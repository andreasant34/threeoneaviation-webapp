from unittest.mock import patch

from django.test import Client, SimpleTestCase, override_settings

from aviationwebapp import views
from aviationwebapp.config import settings as app_settings
from aviationwebapp.models.aircraft import Aircraft
from aviationwebapp.models.airline import Airline
from aviationwebapp.models.photo import Photo
from aviationwebapp.models.registration import Registration
from aviationwebapp.services.content_service import ContentService


def build_archive():
    app_settings.CDN_URL = "https://cdn.example.test/"
    airline = Airline("airline-1", "Air Hamburg", "airline-cover", "")
    aircraft = Aircraft("aircraft-1", "Embraer Legacy 650E", airline)
    registration = Registration("registration-1", "D-ATOP", "registration-cover", aircraft)
    related = Registration("registration-2", "D-AERO", "related-cover", aircraft)
    aircraft.registrations = [registration, related]
    airline.aircrafts = [aircraft]
    cover = Photo(
        "photo-1", "cover-wm.jpg", "Sep 05, 2021", 1800, 1200, "Canon EOS R5",
        exposure_time=0.001, aperture=8, focal_length=300, iso_speed=200,
        description="Arriving in warm evening light."
    )
    detail = Photo("photo-2", "side-wm.jpg", "Sep 05, 2021", 1800, 1200, "Canon EOS R5")
    return airline, registration, cover, detail


class PublicPageTests(SimpleTestCase):
    def setUp(self):
        self.client = Client()

    def test_editorial_and_trust_pages_render_with_unique_canonicals(self):
        for path in ("/about", "/contact", "/spotting-guide", "/privacy-policy"):
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, f'https://threeoneaviation.com{path}')

    @override_settings(DEBUG=False)
    def test_not_found_is_a_real_ad_free_404(self):
        response = self.client.get("/not-a-real-page")
        self.assertEqual(response.status_code, 404)
        self.assertContains(response, "noindex,follow", status_code=404)
        self.assertNotContains(response, "pagead2.googlesyndication.com", status_code=404)

    def test_registration_page_exposes_real_photo_metadata(self):
        airline, registration, cover, detail = build_archive()
        service = views.ContentServiceInstance
        with (
            patch.object(service, "get_airline", return_value=airline),
            patch.object(service, "get_registration_photos", return_value=[cover, detail]),
            patch.object(service, "get_registrations_count", return_value=2),
        ):
            response = self.client.get("/collection/air_hamburg/d-atop")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "D-ATOP — Embraer Legacy 650E")
        self.assertContains(response, "Sep 05, 2021")
        self.assertContains(response, "Canon EOS R5")
        self.assertContains(response, "1/1000 s")
        self.assertContains(response, "f/8")
        self.assertContains(response, "300 mm")
        self.assertContains(response, "Arriving in warm evening light.")
        self.assertContains(response, "D-AERO")
        self.assertContains(response, "Aircraft spotting entry")

    @override_settings(DEBUG=False)
    def test_unknown_registration_returns_404_instead_of_collection_content(self):
        airline, _, _, _ = build_archive()
        with patch.object(views.ContentServiceInstance, "get_airline", return_value=airline):
            response = self.client.get("/collection/air_hamburg/not-real")
        self.assertEqual(response.status_code, 404)

    def test_homepage_has_substantive_archive_content(self):
        airline, registration, _, _ = build_archive()
        service = views.ContentServiceInstance
        with (
            patch.object(service, "get_airlines", return_value=[airline]),
            patch.object(service, "get_latest_registrations", return_value=[registration]),
            patch.object(service, "get_registrations_count", return_value=2),
        ):
            response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "A searchable record, not just a photo stream")
        self.assertContains(response, "D-ATOP")
        self.assertContains(response, 'name="google-adsense-account"')
        self.assertNotContains(response, "pagead2.googlesyndication.com")
        self.assertNotContains(response, "wallpaper.png")
        self.assertNotContains(response, 'class="wallpaper')
        self.assertContains(response, "Reserved AdSense placement: home-horizontal")

    @override_settings(ADSENSE_AD_UNITS_ENABLED=True)
    def test_prepared_home_and_collection_ads_can_be_enabled(self):
        airline, registration, _, _ = build_archive()
        service = views.ContentServiceInstance
        with (
            patch.object(service, "get_airlines", return_value=[airline] * 4),
            patch.object(service, "get_registrations_count", return_value=2),
        ):
            collection_response = self.client.get("/collection")

        self.assertEqual(collection_response.status_code, 200)
        self.assertContains(collection_response, 'data-ad-slot="2603309691"')
        self.assertNotContains(collection_response, 'data-ad-slot="4618144653"')
        self.assertContains(collection_response, "pagead2.googlesyndication.com", count=1)
        self.assertContains(collection_response, '<aside class="ad-placement', count=1)

        with (
            patch.object(service, "get_airlines", return_value=[airline]),
            patch.object(service, "get_latest_registrations", return_value=[registration]),
            patch.object(service, "get_registrations_count", return_value=2),
        ):
            home_response = self.client.get("/")

        self.assertEqual(home_response.status_code, 200)
        self.assertContains(home_response, 'data-ad-slot="4618144653"')
        self.assertNotContains(home_response, 'data-ad-slot="2603309691"')
        self.assertContains(home_response, "pagead2.googlesyndication.com", count=1)
        self.assertContains(home_response, '<aside class="ad-placement', count=1)

    def test_drive_metadata_is_preserved_for_editorial_captions(self):
        app_settings.CDN_URL = "https://cdn.example.test/"
        files = [{
            "id": "photo-1",
            "name": "aircraft-wm.jpg",
            "description": "A manually written spotting note.",
            "imageMediaMetadata": {
                "time": "2021:09:05 18:30:00",
                "width": 1800,
                "height": 1200,
                "cameraMake": "Canon",
                "cameraModel": "Canon EOS R5",
                "exposureTime": 0.001,
                "aperture": 8,
                "focalLength": 300,
                "isoSpeed": 200,
            },
        }]

        photo = ContentService._ContentService__files_as_photos(files)[0]
        self.assertEqual(photo.date_taken, "Sep 05, 2021")
        self.assertEqual(photo.setting_summary, "1/1000 s · f/8 · 300 mm · ISO 200")
        self.assertEqual(photo.description, "A manually written spotting note.")
