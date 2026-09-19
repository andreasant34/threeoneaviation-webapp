from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from aviationwebapp.models.airline import Airline
    from aviationwebapp.models.registration import Registration

class Aircraft:
    """Represents an aircraft type
    """

    def __init__(self, aircraft_id: str, name: str):
        self.id = aircraft_id
        self.name = name
        self.short_name = name.lower().replace(" ", "_")

    def set_airline(self, airline: Airline):
        self.airline = airline

    def set_registrations(self, registrations: list[Registration]):
        self.registrations = registrations