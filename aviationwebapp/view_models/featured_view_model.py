from dataclasses import dataclass
from typing import List
from aviationwebapp.models.photo import Photo
from aviationwebapp.models.registration import Registration

@dataclass
class FeaturedViewModel:
    featured: List[Photo]
    latest_registrations: List[Registration]
    highlight_featured_menu_item: bool

