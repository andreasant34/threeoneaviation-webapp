from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials
from typing import List, Dict
from aviationwebapp.config import settings
import json

class GoogleDriveClient:
    """Connects with Google Drive and retrieves the requested data"""

    def __init__(self):
        try:
            keyfile_dict = json.loads(settings.GOOGLE_SERVICE_ACCOUNT_TOKEN)
            credentials = ServiceAccountCredentials.from_json_keyfile_dict(keyfile_dict, ['https://www.googleapis.com/auth/drive.readonly'])
            self.client = build('drive', 'v3', credentials=credentials)
        except Exception as e:
            print(e)

    def get_minified_files_basic(self) -> List[Dict]:
        query = "name='-min.jpg' and not name='cover-min.jpg' and not trashed"
        fields = "nextPageToken,files(id,name,parents)"
        return self.get_paginated_result(query, fields)

    def get_cover_files_basic(self)-> List[Dict]:
        """Retrieves all cover image files"""
        query = "name='cover-min.jpg' and not trashed"
        fields = "nextPageToken,files(id,name,parents)"
        return self.get_paginated_result(query, fields)

    def get_folder_hierarchy(self)-> List[Dict]:
        """Retrieves the folder hierarchy within Google Drive"""
        query = f"mimeType='application/vnd.google-apps.folder' and not trashed"
        fields = "nextPageToken,files(id,name,parents)"
        return self.get_paginated_result(query, fields)

    def get_watermarked_files_detailed(self)-> List[Dict]:
        """Retrieves all watermarked files"""
        query = f"not trashed and name contains '-wm.jpg'"
        fields="nextPageToken,files(id,name,parents,imageMediaMetadata(time,cameraModel,exposureTime,aperture,focalLength,isoSpeed))"
        return self.get_paginated_result(query, fields)

    def get_paginated_result(self, query:str, fields:str)-> List[Dict]:
        """Retrieves the folder hierarchy within Google Drive"""
        all_results = []
        page_token = None

        while True:
            results = self.client.files().list(
                pageSize=999,
                fields=fields,
                q=query,
                pageToken=page_token
            ).execute()
            all_results.extend(results.get('files', []))
            page_token = results.get('nextPageToken')
            if not page_token:
                break

        return all_results