import os
from datetime import datetime
from aviationwebapp.config import settings

class CachedItem:
    """Represents a cached item within our InMemoryCache."""
    def __init__(self, key:str, item: object):
        self.key = key
        self.item = item
        self.last_updated = datetime.now()

class InMemoryCache:
    """Simple in-memory cache"""
    def __init__(self):
        self.cache = dict()
        self.expiration = settings.CACHE_EXPIRATION

    def get(self,key):
        """Retrieve an item from the cache if it hasn't expired."""
        if key not in self.cache:
            return None

        cached_item = self.cache[key]
        cache_diff = datetime.now() - cached_item.last_updated

        if cache_diff.total_seconds() <= self.expiration:
            return cached_item.item

        return None

    def set(self, key, value):
        """Store an item in the cache."""
        self.cache[key] = CachedItem(key,value)