from __future__ import annotations
from aviationwebapp.config import settings
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from aviationwebapp.models.photo import Photo

class LocalEvent:

    def __init__(self, local_event_id:str, name: str):
        self.id = local_event_id
        self.name = name

    @property
    def short_name(self):
        return self.name.lower().replace(" ", "_")

    @property
    def cover_url(self):
        return settings.CDN_URL + self.cover_id + ".jpg" if self.cover_id else None

    def set_cover(self, cover_file: dict):
        self.cover_id = cover_file['id']

    def set_photos(self, photos: list[Photo]):
        self.photos = photos