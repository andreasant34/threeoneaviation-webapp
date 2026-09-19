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
        self.short_name = name.lower().replace(" ", "_")

    def set_aircrafts(self, aircrafts: list[Aircraft]):
        self.aircrafts = aircrafts
        self.aircraft_registration_example = next((r.name for a in self.aircrafts for r in (a.registrations or [])),None)

    def set_cover(self, cover_file: dict):
        self.cover_id = cover_file['id']
        self.cover_url = settings.CDN_URL + self.cover_id + ".jpg" if self.cover_id else None

    def find_registration(self, registration_name: str):
        return next((r for a in self.aircrafts for r in (a.registrations or []) if r.name.lower() == registration_name.lower()),None)