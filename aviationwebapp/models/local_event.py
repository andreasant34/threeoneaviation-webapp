from aviationwebapp.config import settings

class LocalEvent:

    def __init__(self, local_event_id:str, name: str, cover_id: str):
        self.id = local_event_id
        self.name = name
        self.short_name = name.lower().replace(" ", "_")
        self.cover_id = cover_id
        self.cover_url = settings.CDN_URL + cover_id + ".jpg" if cover_id else None
