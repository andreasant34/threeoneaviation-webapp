from django.conf import settings


def adsense_settings(request):
    """Expose the manual ad-unit switch to every rendered page."""
    return {
        "adsense_ad_units_enabled": settings.ADSENSE_AD_UNITS_ENABLED,
    }
