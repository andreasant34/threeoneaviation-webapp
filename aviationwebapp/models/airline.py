from aviationwebapp.config import settings

class Airline:
    """Represents an airline

    Attributes:
        cover_id (str): The id of the cover image of this airline
        cover_url (str): The url of the cover image of this airline
        logo_id (str): The id of the logo image of this airline
        logo_url (str): The url of the logo image of this airline
        aircrafts (list[Aircraft]): A collection of aircraft types of this airline
    """

    def __init__(self, airline_id: str, name: str, cover_id: str, logo_id: str):
        self.id = airline_id
        self.name = name
        self.short_name = name.lower().replace(" ", "_")
        self.aircrafts = None

        self.cover_id = cover_id
        self.cover_url = settings.CDN_URL + cover_id + ".jpg" if cover_id else None

        self.logo_id = logo_id
        self.logo_url = settings.CDN_URL + logo_id + ".jpg" if logo_id else None