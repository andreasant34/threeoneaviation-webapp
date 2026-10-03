from __future__ import annotations
from aviationwebapp.config import settings
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from aviationwebapp.models.aircraft import Aircraft

class Airline:
    """Represents an airline
    """

    def __init__(self, airline_id: str, name: str):
        self.id = airline_id
        self.name = name

    def set_aircrafts(self, aircrafts: list[Aircraft]):
        self.aircrafts = aircrafts

    def set_cover(self, cover_file: dict):
        self.cover_id = cover_file['id']

    @property
    def short_name(self):
        return self.name.lower().replace(" ", "_")

    @property
    def cover_url(self):
        return settings.CDN_URL + self.cover_id + ".jpg" if self.cover_id else None

    @property
    def aircraft_registration_example(self):
        return next((r.name for r in self.registrations), None)

    @property
    def latest_captured_date(self):
        return sorted(self.photos, key=lambda x: x.capture_time, reverse=True)[:1][0].date_taken

    @property
    def registrations(self):
        return sorted([registration for aircraft in self.aircrafts for registration in (aircraft.registrations or [])], key=lambda x: x.short_name)

    @property
    def photos(self):
        return [photo for aircraft in self.aircrafts for registration in (aircraft.registrations or []) for photo in registration.photos]

    @property
    def registration_count(self):
        return len(self.registrations)

    def find_registration(self, registration_name: str):
        return next((registration for registration in (self.registrations or []) if registration.name.casefold() == registration_name.casefold()), None)