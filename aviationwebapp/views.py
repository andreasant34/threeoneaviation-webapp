from django.http import Http404
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
    airlines = ContentServiceInstance.get_airlines()
    return render(request, 'home/index.html', {
        'airlines_count': len(airlines),
        'latest_registrations': ContentServiceInstance.get_latest_registrations(),
        'registrations_count': ContentServiceInstance.get_registrations_count(),
    })

def not_found(request,exception):
    return render(request, '404.html', status=404)

def error(request):
    return render(request, '500.html', status=500)

def about(request):
    return render(request, 'about.html', {'highlight_about_menu_item': True})

def contact(request):
    return render(request, 'contact.html', {'highlight_contact_menu_item': True})

def spotting_guide(request):
    return render(request, 'spotting-guide.html', {'highlight_guide_menu_item': True})

def privacy_policy(request):
    return render(request, 'privacy-policy.html')

def ads_txt(request):
    return render(request, 'ads.txt', content_type='text/plain')

def robots_txt(request):
    return render(request, 'robots.txt', content_type='text/plain')

def sitemap(request):
    return render(
        request,
        'sitemap.xml',
        {'airlines': ContentServiceInstance.get_airlines()},
        content_type='application/xml'
    )

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
        registration = ContentServiceInstance.get_registration(airline, registration_name)

        if registration is None:
            raise Http404("Aircraft registration not found")

        photos = ContentServiceInstance.get_registration_photos(airline, registration_name)

        cover_photos = [p for p in photos if "cover" in p.name]
        other_photos = [p for p in photos if "cover" not in p.name]
        cover = cover_photos[0] if cover_photos else (other_photos[0] if other_photos else None)
        if not cover_photos and other_photos:
            other_photos = other_photos[1:]

        view_model = CollectionSingleSearchViewModel(
            airline= airline,
            aircraft= registration.aircraft,
            highlight_collection_menu_item= True,
            registration_name= registration.name,
            registration_photos= other_photos,
            cover= cover,
            photo_count= len(photos),
            related_registrations= [
                item for item in registration.aircraft.registrations
                if item.short_name != registration.short_name
            ][:6],
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

    raise Http404("Airline collection not found")

def __render_root_collection(request):
    """Renders the root collection view that lists airlines"""
    airlines = ContentServiceInstance.get_airlines()

    view_model = CollectionRootViewModel(
        airlines = airlines,
        highlight_collection_menu_item = True,
        registrations_count=ContentServiceInstance.get_registrations_count()
    )

    return render(request, 'collection/collection.html', asdict(view_model))
