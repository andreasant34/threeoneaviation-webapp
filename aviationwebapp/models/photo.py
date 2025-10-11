from aviationwebapp.config import settings

class Photo:
    """Represents a single photo

    Attributes:
        max_image_id (str): The id of the photo's original image
        max_image_url (str): The url of the photo's original image
        min_image_id (str): The id of the photo's minimized image
        min_image_url (str): The url of the photo's minimized image
    """

    def __init__(self, max_image_id: str, name: str, date_taken: str, width: int, height: int, camera_model: str):
        self.max_image_id = max_image_id
        self.max_image_url = settings.CDN_URL + max_image_id + ".jpg"

        self.min_image_id = self.max_image_id
        self.min_image_url = self.max_image_url

        self.date_taken = date_taken
        self.name = name
        self.data_size = str(width) + "x" + str(height)
        self.camera_model = camera_model

    def set_min_image(self, min_image_id: str):
        """Sets the respective minimized image of this photo"""
        self.min_image_id = min_image_id
        self.min_image_url = self.max_image_url if min_image_id == self.max_image_id \
            else settings.CDN_URL + min_image_id + ".jpg"