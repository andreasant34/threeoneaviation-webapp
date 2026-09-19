from collections import defaultdict
from datetime import datetime
from typing import List

from aviationwebapp.config import settings
from aviationwebapp.utils.in_memory_cache import InMemoryCache
from aviationwebapp.clients.google_drive_client import GoogleDriveClient
from aviationwebapp.models.airline import Airline
from aviationwebapp.models.registration import Registration
from aviationwebapp.models.photo import Photo
from aviationwebapp.models.aircraft import Aircraft
from aviationwebapp.models.local_event import LocalEvent
from aviationwebapp.models.core_content import CoreContent

class ContentService:
    """Responsible for retrieving and transforming content"""

    def __init__(self):
        self.client = GoogleDriveClient()
        self.cache = InMemoryCache()
        return

    def get_airlines(self) -> List[Airline]:
        core = self.__get_core_content()
        return core.airlines

    def get_featured_photos(self) -> List[Photo]:
        core = self.__get_core_content()
        return core.featured_photos

    def get_latest_photos(self) -> List[Photo]:
        """Retrieves the photos that were added recently"""
        core = self.__get_core_content()
        return core.latest_photos

    def get_airline(self, airline_name: str) -> Airline | None:
        airlines = self.get_airlines()
        return next((x for x in airlines if x.short_name.lower() == airline_name.lower()), None)

    def get_registrations_count(self) -> int:
        """Retrieves the total number of registrations"""
        core = self.__get_core_content()
        return core.registrations_count

    def __get_core_content(self) -> CoreContent | None:
        cache_key = 'core'
        cached = self.cache.get(cache_key)
        if cached is not None:
            return cached

        minified_files  = self.client.get_minified_files_basic()
        dic_minified_files_by_normalized_name = self.__to_dictionary(minified_files, lambda x: self.__normalize_file_name(x['name']))

        covers = self.client.get_cover_files_basic()
        dic_covers_by_parent_id = self.__to_dictionary(covers, lambda x: x['parents'][0])

        watermarked_files = self.client.get_watermarked_files_detailed()
        lkp_watermarked_files_by_parent_id = self.__to_lookup(watermarked_files, lambda x: x['parents'][0])

        all_folders = [f for f in self.client.get_folder_hierarchy() if 'parents' in f]
        lkp_all_folders_by_parent_id = self.__to_lookup(all_folders, lambda x: x['parents'][0])

        dic_photos_by_name = {}

        airlines = []
        local_events = []
        featured_photos = []
        all_photos = []

        for airline_file in lkp_all_folders_by_parent_id[settings.ROOT_FOLDER_ID]:
            airline = Airline(airline_file['id'], airline_file['name'])
            airline.set_aircrafts([])
            airline.set_cover(dic_covers_by_parent_id[airline_file['id']])
            airlines.append(airline)

            for aircraft_file in lkp_all_folders_by_parent_id[airline_file['id']]:
                aircraft = Aircraft(aircraft_file['id'], aircraft_file['name'])
                aircraft.set_airline(airline)
                aircraft.set_registrations([])
                airline.aircrafts.append(aircraft)

                for registration_file in lkp_all_folders_by_parent_id[aircraft_file['id']]:
                    registration = Registration(registration_file['id'], registration_file['name'])
                    registration.set_aircraft(aircraft)
                    registration.set_photos([])
                    registration.set_cover(dic_covers_by_parent_id[registration_file['id']])
                    aircraft.registrations.append(registration)

                    for watermarked_file in lkp_watermarked_files_by_parent_id[registration_file['id']]:
                        photo = self.__watermarked_file_as_photo(watermarked_file)
                        photo.set_registration(registration)
                        registration.photos.append(photo)
                        all_photos.append(photo)

        for local_event_file in lkp_all_folders_by_parent_id[settings.EVENTS_FOLDER_ID]:
            local_event = LocalEvent(local_event_file['id'], local_event_file['name'])
            local_event.set_photos([])
            local_events.append(local_event)

            for watermarked_file in lkp_watermarked_files_by_parent_id[local_event_file['id']]:
                photo = self.__watermarked_file_as_photo(watermarked_file)
                photo.set_local_event(local_event)
                local_event.photos.append(photo)
                all_photos.append(photo)

        for photo in all_photos:
            dic_photos_by_name[photo.name] = photo

            min_image = dic_minified_files_by_normalized_name.get(self.__normalize_file_name(photo.name))
            if min_image:
                photo.set_min_image(min_image['id'])

        for featured_file in lkp_watermarked_files_by_parent_id[settings.FEATURED_FOLDER_ID]:
            photo = dic_photos_by_name[featured_file['name']]
            featured_photos.append(photo)

        latest_photos = sorted(all_photos, key=lambda x: x.date_taken, reverse=True)[:6]

        core_content = CoreContent(airlines, local_events, featured_photos, latest_photos)
        self.cache.set(cache_key, core_content)
        return core_content

    @staticmethod
    def __to_lookup(items, key_selector):
        lookup = defaultdict(list)

        for item in items:
            lookup[key_selector(item)].append(item)

        return lookup

    @staticmethod
    def __to_dictionary(items, key_selector):
        return {key_selector(item): item for item in items}

    @staticmethod
    def __normalize_file_name(file_name):
        return file_name.replace("-wm.jpg", ".jpg").replace("-min.jpg", ".jpg")

    @staticmethod
    def __watermarked_file_as_photo(watermarked_file) -> Photo:
        metadata = watermarked_file.get("imageMediaMetadata", {})
        capture_time = metadata.get("time")
        formatted_capture_time = datetime.strptime(
            capture_time, "%Y:%m:%d %H:%M:%S"
        ).strftime("%b %d, %Y") if capture_time else "Date not recorded"

        return Photo(
            watermarked_file["id"], watermarked_file["name"],
            formatted_capture_time,
            metadata.get("width", 0),
            metadata.get("height", 0),
            metadata.get("cameraModel", ""),
            exposure_time=metadata.get("exposureTime"),
            aperture=metadata.get("aperture"),
            focal_length=metadata.get("focalLength"),
            iso_speed=metadata.get("isoSpeed")
        )
