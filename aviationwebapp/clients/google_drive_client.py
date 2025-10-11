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

    def get_featured_files(self)-> List[Dict]:
        """Retrieves all image files marked as featured"""
        query = f"'{settings.FEATURED_FOLDER_ID}' in parents and not trashed"
        results = self.client.files().list(
            pageSize=999,
            fields="files(*)",
            q=query
        ).execute()
        return results.get('files', [])

    def get_files_descending(self)-> List[Dict]:
        """Retrieves the latest image files which were added recently"""
        query = f"not trashed and name contains '-wm.jpg'"
        results = self.client.files().list(
            pageSize=999,
            fields="files(id,name,parents,modifiedTime)",
            q=query,
            orderBy="modifiedTime desc"
        ).execute()
        return results.get('files', [])

    def get_cover_files(self)-> List[Dict]:
        """Retrieves all cover image files"""
        query = "name='cover-min.jpg' and not trashed"
        results = self.client.files().list(
            pageSize=999,
            fields="files(id,name,parents)",
            q=query
        ).execute()
        return results.get('files', [])

    def get_logo_files(self)-> List[Dict]:
        """Retrieves all logo image files"""
        query = "name='logo-min.jpg' and not trashed"
        results = self.client.files().list(
            pageSize=999,
            fields="files(id,name,parents)",
            q=query
        ).execute()
        return results.get('files', [])

    def get_registration_files(self, registration_id)-> List[Dict]:
        """Retrieves all image files of the given registration"""
        query = f"'{registration_id}' in parents and not trashed"
        results = self.client.files().list(
            pageSize=999,
            fields="files(*)",
            q=query
        ).execute()
        return results.get('files', [])

    def get_folder_hierarchy(self)-> List[Dict]:
        """Retrieves the folder hierarchy within Google Drive"""
        query = f"mimeType='application/vnd.google-apps.folder' and not trashed"
        fields = "nextPageToken,files(id,name,parents)"
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