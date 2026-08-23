from dataclasses import dataclass
from typing import List

from aviationwebapp.models.aircraft import Aircraft
from aviationwebapp.models.airline import Airline
from aviationwebapp.models.photo import Photo
from aviationwebapp.models.registration import Registration

@dataclass
class CollectionSingleSearchViewModel:
    airline: Airline
    aircraft: Aircraft
    registration_name: str
    registration_photos: List[Photo]
    cover: Photo
    photo_count: int
    related_registrations: List[Registration]
    highlight_collection_menu_item: bool
    registrations_count: int

@dataclass
class CollectionMultiSearchViewModel:
    registrations: List[Registration]
    highlight_collection_menu_item: bool
    registrations_count: int
    search_param: str

@dataclass
class CollectionAirlineSearchViewModel:
    airline: Airline
    highlight_collection_menu_item: bool
    registrations_count: int

@dataclass
class CollectionRootViewModel:
    airlines: List[Airline]
    highlight_collection_menu_item: bool
    registrations_count: int
