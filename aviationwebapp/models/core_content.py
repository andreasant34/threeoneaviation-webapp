from aviationwebapp.models.airline import Airline
from aviationwebapp.models.local_event import LocalEvent

class CoreContent:
    """A wrapper for the frequently-used content

    Attributes:
        airlines (list[Airline]): A collection of Airlines
        covers (list[Photo]): A collection of cover photos
        logos (list[Photo]): A collection of logo photos
        registrations_count (int): The total number of registrations across all airlines
    """

    def __init__(self, airlines: list[Airline], covers, logos, minified_files, local_events: list[LocalEvent]):
        self.airlines = airlines
        self.covers = covers
        self.logos = logos
        self.minified_files = minified_files
        self.registrations = [r for a in airlines for c in a.aircrafts for r in c.registrations]
        self.registrations_count = len(self.registrations)
        self.local_events = local_events