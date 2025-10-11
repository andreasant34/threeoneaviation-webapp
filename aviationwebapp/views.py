from django.shortcuts import render
from dataclasses import asdict
from aviationwebapp.services.content_service import ContentService
from aviationwebapp.view_models.featured_view_model import FeaturedViewModel
from  aviationwebapp.view_models.collection_view_models import CollectionSingleSearchViewModel
from  aviationwebapp.view_models.collection_view_models import CollectionMultiSearchViewModel
from  aviationwebapp.view_models.collection_view_models import CollectionAirlineSearchViewModel
from  aviationwebapp.view_models.collection_view_models import CollectionRootViewModel
ContentServiceInstance = ContentService()

def home(request):
    return render(request, 'home/index.html')

def not_found(request,exception):
    return render(request, '404.html')

def error(request):
    return render(request, '500.html')    

def featured(request):
    featured_result = ContentServiceInstance.get_featured()
    latest_registrations = ContentServiceInstance.get_latest_registrations()

    view_model = FeaturedViewModel(
        featured=featured_result,
        latest_registrations=latest_registrations,
        highlight_featured_menu_item=True
    )

    return render(request, 'featured/featured.html', asdict(view_model))

def collection(request, airline_name: str = None, registration_name: str = None):
    search_param = request.GET.get('search','').strip().lower()
    if len(search_param) > 0:
       return __render_search_param(request, search_param)

    if airline_name is not None:
       return __render_airline_and_or_registration(request, airline_name, registration_name)
    
    return __render_root_collection(request)

def __render_search_param(request, search_param):
    """Renders one or more registrations based on the given search param"""
    airlines = ContentServiceInstance.get_airlines()

    filtered_registrations = [
        r for a in airlines for c in a.aircrafts for r in c.registrations if search_param in r.name.lower()
    ]

    if len(filtered_registrations) == 1:
        return __render_airline_and_or_registration(
            request,
            filtered_registrations[0].aircraft.airline.short_name,
            filtered_registrations[0].short_name
        )
    else:
        view_model = CollectionMultiSearchViewModel(
            registrations = filtered_registrations,
            highlight_collection_menu_item = True,
            registrations_count = ContentServiceInstance.get_registrations_count()
        )
        return render(request, 'collection/search.html', asdict(view_model))

def __render_airline_and_or_registration(request, airline_name:str, registration_name:str):
    """Renders a single airline or a single registration if exists"""
    airline = ContentServiceInstance.get_airline(airline_name)

    if airline is not None and registration_name is not None:
        photos = ContentServiceInstance.get_registration_photos(airline, registration_name)
        registration = ContentServiceInstance.get_registration(airline, registration_name)

        if registration is None: #Invalid registration, view the default list of airlines
            return __render_root_collection(request)

        cover_photos = [p for p in photos if "cover" in p.name]
        other_photos = [p for p in photos if "cover" not in p.name]
        cover_photos = cover_photos or other_photos

        # Fallback if there isn't a cover photo
        cover = cover_photos[0] if cover_photos else None

        view_model = CollectionSingleSearchViewModel(
            airline= airline,
            aircraft= registration.aircraft,
            highlight_collection_menu_item= True,
            registration_name= registration_name.upper(),
            registration_photos= other_photos,
            cover= cover,
            registrations_count= ContentServiceInstance.get_registrations_count()
        )

        return render(request, 'collection/single.html', asdict(view_model))

    if airline is not None:
        view_model = CollectionAirlineSearchViewModel(
            airline= airline,
            highlight_collection_menu_item= True,
            registrations_count = ContentServiceInstance.get_registrations_count()
        )

        return render(request, 'collection/registrations.html', asdict(view_model))

    return __render_root_collection(request)

def __render_root_collection(request):
    """Renders the root collection view that lists airlines"""
    airlines = ContentServiceInstance.get_airlines()

    view_model = CollectionRootViewModel(
        airlines = airlines,
        highlight_collection_menu_item = True,
        registrations_count=ContentServiceInstance.get_registrations_count()
    )

    return render(request, 'collection/collection.html', asdict(view_model))

def competition(request):
    return render(request, 'competition/competition.html')