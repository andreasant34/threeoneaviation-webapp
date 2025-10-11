from aviationwebapp.models.airline import Airline

class Aircraft:
    """Represents an aircraft type

    Attributes:
        airline (Airline): The airline of the aircraft type
        registrations (list[Registration]): The registrations of this aircraft type
    """

    def __init__(self, aircraft_id: str, name: str, airline: Airline):
        self.id = aircraft_id
        self.name = name
        self.airline = airline
        self.short_name = name.lower().replace(" ", "_")
        self.registrations = None