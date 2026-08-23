from datetime import datetime
from typing import List

from aviationwebapp.config import settings
from aviationwebapp.utils.in_memory_cache import InMemoryCache
from aviationwebapp.clients.google_drive_client import GoogleDriveClient
from aviationwebapp.models.airline import Airline
from aviationwebapp.models.registration import Registration
from aviationwebapp.models.photo import Photo
from aviationwebapp.models.aircraft import Aircraft
from aviationwebapp.models.core_content import CoreContent

class ContentService:
    """Responsible for retrieving and transforming content"""

    def __init__(self):
        self.client = GoogleDriveClient()
        self.cache = InMemoryCache()
        return

    def get_airlines(self) -> List[Airline]:
        core = self.__get_core_content_without_photos()
        return core.airlines

    def get_featured(self) -> List[Photo]:
        cache_key = 'featured'
        cached = self.cache.get(cache_key)
        if cached is not None:
            return cached

        featured_files = self.client.get_featured_files()
        photos = self.__files_as_photos(featured_files)

        self.cache.set(cache_key, photos)
        return photos

    def get_latest_registrations(self) -> List[Registration]:
        """Retrieves the registrations that were added recently"""
        cache_key = 'latest'
        cached = self.cache.get(cache_key)
        if cached is not None:
            return cached

        core = self.__get_core_content_without_photos()

        max_num_of_items = 6
        latest_registrations : List[Registration] = []
        unique_reg_ids = set([])

        latest_files = self.client.get_files_descending()
        for item in latest_files:
            for r in core.registrations:
                if r.id in item['parents'] and r.id not in unique_reg_ids and len(unique_reg_ids) < max_num_of_items:
                    unique_reg_ids.add(r.id)
                    latest_registrations.append(r)

        self.cache.set(cache_key, latest_registrations)
        return latest_registrations

    def get_airline(self, airline_name: str) -> Airline | None:
        airlines = self.get_airlines()
        for a in airlines:
            if a.short_name == airline_name:
                return a
        return None

    @staticmethod
    def get_registration(airline: Airline, registration_name: str) -> Registration | None:
        for c in airline.aircrafts:
            for r in c.registrations:
                if r.short_name == registration_name:
                    return r
        return None

    def get_registration_photos(self, airline: Airline, registration_name: str) -> List[Photo] | None:
        """Retrieves all photos of the given registration"""
        registration = self.get_registration(airline, registration_name)
        if not registration:
            return None

        cache_key = 'reg:' + registration_name
        cached = self.cache.get(cache_key)
        if cached is not None:
            return cached

        registration_files = self.client.get_registration_files(registration.id)
        photos = self.__files_as_photos(registration_files)

        self.cache.set(cache_key, photos)
        return photos

    def get_registrations_count(self) -> int:
        """Retrieves the total number of registrations"""
        core = self.__get_core_content_without_photos()
        return core.registrations_count

    def __get_core_content_without_photos(self) -> CoreContent | None:
        """Retrieves and transforms all frequently-used content, without photos.
        The Google Drive folder hierarchy is traversed to get the collection tree.
        """
        cache_key = 'core'
        cached = self.cache.get(cache_key)
        if cached is not None:
            return cached

        covers = self.client.get_cover_files()
        logos = self.client.get_logo_files()

        all_folders = [f for f in self.client.get_folder_hierarchy() if 'parents' in f]
        airline_folders = [f for f in all_folders if settings.ROOT_FOLDER_ID in f['parents']]
        airline_ids = [f['id'] for f in airline_folders]
        aircraft_folders = [f for f in all_folders if set(airline_ids) & set(f['parents'])]
        aircraft_ids = [f['id'] for f in aircraft_folders]
        registration_folders = [f for f in all_folders if set(aircraft_ids) & set(f['parents'])]

        airlines = []
        for a in airline_folders:
            airline = Airline(
                a['id'], a['name'],
                self.__get_first_file_by_parent_id(covers, a['id']),
                self.__get_first_file_by_parent_id(logos, a['id'])
            )

            airline.aircrafts =[]
            for c in aircraft_folders:
                if a['id'] in c['parents']:
                    aircraft = Aircraft(c['id'],c['name'],airline)

                    aircraft.registrations = []
                    for r in registration_folders:
                        if c['id'] in r['parents']:
                            registration = Registration(
                                r['id'], r['name'],
                                self.__get_first_file_by_parent_id(covers, r['id']),
                                aircraft
                            )
                            airline.aircraft_registration_example = registration.name
                            aircraft.registrations.append(registration)

                    airline.aircrafts.append(aircraft)

            airlines.append(airline)

        airlines.sort(key= lambda x: x.name.lower())

        core_items = CoreContent(airlines, covers, logos)
        self.cache.set(cache_key, core_items)
        return core_items

    @staticmethod
    def __get_first_file_by_parent_id(files, parent_id) -> str | None:
        """Returns the first file under the given parent"""
        for file in files:
            if parent_id in file['parents']:
                return file["id"]
        return None

    @staticmethod
    def __files_as_photos(files) -> List[Photo]:
        """Converts an array of Google Drive files into a list of Photos"""
        photos = []

        for item in (f for f in files if "-wm.jpg" in f["name"].lower()):
            metadata = item.get("imageMediaMetadata", {})
            capture_time = metadata.get("time")
            formatted_capture_time = datetime.strptime(
                capture_time, "%Y:%m:%d %H:%M:%S"
            ).strftime("%b %d, %Y") if capture_time else "Date not recorded"

            photo = Photo(
                item["id"], item["name"],
                formatted_capture_time,
                metadata.get("width", 0),
                metadata.get("height", 0),
                metadata.get("cameraModel", ""),
                camera_make=metadata.get("cameraMake", ""),
                exposure_time=metadata.get("exposureTime"),
                aperture=metadata.get("aperture"),
                focal_length=metadata.get("focalLength"),
                iso_speed=metadata.get("isoSpeed"),
                description=item.get("description", "")
            )
            photos.append(photo)

        for item in (i for i in files if "-min.jpg" in i["name"].lower()):
            minified_name = item["name"].lower().replace("-min.jpg", ".jpg")
            for photo in (p for p in photos if p.name.lower().replace("-wm.jpg", ".jpg") == minified_name):
                photo.set_min_image(item["id"])

        return photos
