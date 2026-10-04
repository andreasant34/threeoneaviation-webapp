from __future__ import annotations
from aviationwebapp.config import settings
from typing import TYPE_CHECKING
from datetime import datetime

if TYPE_CHECKING:
    from aviationwebapp.models.registration import Registration
    from aviationwebapp.models.local_event import LocalEvent

class Photo:
    """Represents a single photo
    """

    def __init__(
        self,
        max_image_id: str,
        name: str,
        capture_time: datetime,
        width: int,
        height: int,
        camera_model=None,
        exposure_time=None,
        aperture=None,
        focal_length=None,
        iso_speed=None,
        location="Malta International Airport"
    ):
        self.max_image_id = max_image_id
        self.capture_time = capture_time
        self.name = name
        self.width = width
        self.height = height
        self.data_size = str(width) + "x" + str(height)
        self.camera_model = camera_model
        self.exposure_time = self.__format_exposure_time(exposure_time)
        self.aperture = self.__format_number(aperture, "f/")
        self.focal_length = self.__format_number(focal_length, suffix=" mm")
        self.iso_speed = str(iso_speed) if iso_speed not in (None, "") else ""
        self.location = location

    @property
    def date_taken(self):
        return self.capture_time.strftime("%b %d, %Y") if self.capture_time else "Date not recorded"

    @property
    def time_taken(self):
        return self.capture_time.strftime("%I:%M %p") if self.capture_time else "Time not recorded"

    @property
    def max_image_url(self):
        return settings.CDN_URL + self.max_image_id + ".jpg"

    @property
    def min_image_url(self):
        return self.max_image_url if self.min_image_id == self.max_image_id \
            else settings.CDN_URL + self.min_image_id + ".jpg"

    def set_registration(self, registration: Registration):
        self.registration = registration

    def set_local_event(self, local_event: LocalEvent):
        self.local_event = local_event

    def set_min_image(self, min_image_id: str):
        """Sets the respective minimized image of this photo"""
        self.min_image_id = min_image_id

    @staticmethod
    def __format_number(value, prefix="", suffix="") -> str:
        if value in (None, ""):
            return ""
        try:
            number = float(value)
            formatted = f"{number:g}"
        except (TypeError, ValueError):
            formatted = str(value)
        return prefix + formatted + suffix

    @staticmethod
    def __format_exposure_time(value) -> str:
        if value in (None, ""):
            return ""
        try:
            seconds = float(value)
        except (TypeError, ValueError):
            return str(value)

        if seconds <= 0:
            return ""
        if seconds < 1:
            return f"1/{round(1 / seconds)} s"
        return f"{seconds:g} s"
