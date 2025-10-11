from aviationwebapp.models.aircraft import Aircraft
from aviationwebapp.config import settings

class Registration:
    """Represents a single airplane with a given registration number.

    Attributes:
        aircraft (Aircraft): The aircraft type that this registration belongs to
        cover_id (str): The id of the registration cover photo
        cover_url (str): The url of the cover photo
    """

    def __init__(self, registration_id: str, name: str, cover_id: str, aircraft: Aircraft):
        self.id = registration_id
        self.name = name
        self.aircraft = aircraft
        self.cover_id = cover_id
        self.short_name = name.lower().replace(" ", "_")

        self.cover_url = settings.CDN_URL + cover_id + ".jpg" if cover_id else None