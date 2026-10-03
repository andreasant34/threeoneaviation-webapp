from __future__ import annotations
from aviationwebapp.config import settings
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from aviationwebapp.models.aircraft import Aircraft
    from aviationwebapp.models.photo import Photo

class Registration:
    """Represents a single airplane with a given registration number.
    """

    def __init__(self, registration_id: str, name: str):
        self.id = registration_id
        self.name = name

    @property
    def short_name(self):
        return self.name.lower().replace(" ", "_")

    @property
    def cover_url(self):
        return settings.CDN_URL + self.cover_id + ".jpg" if self.cover_id else None

    @property
    def latest_captured_date(self):
        return sorted(self.photos, key=lambda x: x.capture_time, reverse=True)[:1][0].date_taken

    def set_aircraft(self, aircraft: Aircraft):
        self.aircraft = aircraft

    def set_cover(self, cover_file: dict):
        self.cover_id = cover_file['id']

    def set_photos(self, photos: list[Photo]):
        self.photos = photos
