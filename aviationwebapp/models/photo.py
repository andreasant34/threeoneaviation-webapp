from aviationwebapp.config import settings

class Photo:
    """Represents a single photo

    Attributes:
        max_image_id (str): The id of the photo's original image
        max_image_url (str): The url of the photo's original image
        min_image_id (str): The id of the photo's minimized image
        min_image_url (str): The url of the photo's minimized image
    """

    def __init__(
        self,
        max_image_id: str,
        name: str,
        date_taken: str,
        width: int,
        height: int,
        camera_model: str,
        camera_make: str = "",
        exposure_time=None,
        aperture=None,
        focal_length=None,
        iso_speed=None,
        description: str = ""
    ):
        self.max_image_id = max_image_id
        self.max_image_url = settings.CDN_URL + max_image_id + ".jpg"

        self.min_image_id = self.max_image_id
        self.min_image_url = self.max_image_url

        self.date_taken = date_taken
        self.name = name
        self.data_size = str(width) + "x" + str(height)
        self.camera_model = camera_model
        self.camera_make = camera_make
        self.exposure_time = self.__format_exposure_time(exposure_time)
        self.aperture = self.__format_number(aperture, "f/")
        self.focal_length = self.__format_number(focal_length, suffix=" mm")
        self.iso_speed = str(iso_speed) if iso_speed not in (None, "") else ""
        self.description = description or ""
        self.setting_summary = " · ".join(
            value for value in (
                self.exposure_time,
                self.aperture,
                self.focal_length,
                "ISO " + self.iso_speed if self.iso_speed else ""
            ) if value
        )

    def set_min_image(self, min_image_id: str):
        """Sets the respective minimized image of this photo"""
        self.min_image_id = min_image_id
        self.min_image_url = self.max_image_url if min_image_id == self.max_image_id \
            else settings.CDN_URL + min_image_id + ".jpg"

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
