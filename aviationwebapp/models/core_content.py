from aviationwebapp.models.airline import Airline
from aviationwebapp.models.local_event import LocalEvent
from aviationwebapp.models.photo import Photo

class CoreContent:
    """A wrapper for the frequently-used content

    Attributes:
        airlines (list[Airline]): A collection of Airlines
    """
    def __init__(self, airlines: list[Airline], local_events: list[LocalEvent], featured_photos: list[Photo], latest_photos: list[Photo]):
        self.airlines = airlines
        self.registrations = [r for a in airlines for c in a.aircrafts for r in c.registrations]
        self.registrations_count = len(self.registrations)
        self.local_events = local_events
        self.featured_photos = featured_photos
        self.latest_photos = latest_photos