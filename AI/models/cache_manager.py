import redis
from django.conf import settings
import json
import logging
from functools import wraps
import hashlib
import pickle

logger = logging.getLogger(__name__)

class CacheManager:
    _instance = None
    _redis_client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CacheManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._redis_client is None:
            self._initialize_redis()
    
    def _initialize_redis(self):
        """Initialize Redis connection"""
        try:
            self._redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                decode_responses=True
            )
        except Exception as e:
            logger.error(f"Error initializing Redis: {str(e)}")
            self._redis_client = None
    
    def get(self, key):
        """Get value from cache"""
        try:
            if self._redis_client:
                value = self._redis_client.get(key)
                return json.loads(value) if value else None
            return None
        except Exception as e:
            logger.error(f"Error getting from cache: {str(e)}")
            return None
    
    def set(self, key, value, expire=3600):
        """Set value in cache"""
        try:
            if self._redis_client:
                self._redis_client.setex(
                    key,
                    expire,
                    json.dumps(value)
                )
                return True
            return False
        except Exception as e:
            logger.error(f"Error setting cache: {str(e)}")
            return False
    
    def delete(self, key):
        """Delete value from cache"""
        try:
            if self._redis_client:
                self._redis_client.delete(key)
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting from cache: {str(e)}")
            return False
    
    def clear(self):
        """Clear all cache"""
        try:
            if self._redis_client:
                self._redis_client.flushdb()
                return True
            return False
        except Exception as e:
            logger.error(f"Error clearing cache: {str(e)}")
            return False
    
    def cache_key(self, func_name, *args, **kwargs):
        """Generate cache key from function name and arguments"""
        key_parts = [func_name]
        
        # Add args to key
        for arg in args:
            if isinstance(arg, (str, int, float, bool)):
                key_parts.append(str(arg))
            else:
                key_parts.append(hashlib.md5(pickle.dumps(arg)).hexdigest())
        
        # Add kwargs to key
        for k, v in sorted(kwargs.items()):
            if isinstance(v, (str, int, float, bool)):
                key_parts.append(f"{k}:{v}")
            else:
                key_parts.append(f"{k}:{hashlib.md5(pickle.dumps(v)).hexdigest()}")
        
        return ":".join(key_parts)

def cache_result(expire=3600):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_manager = CacheManager()
            
            # Generate cache key
            cache_key = cache_manager.cache_key(func.__name__, *args, **kwargs)
            
            # Try to get from cache
            cached_result = cache_manager.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # If not in cache, execute function
            result = func(*args, **kwargs)
            
            # Cache result
            cache_manager.set(cache_key, result, expire)
            
            return result
        return wrapper
    return decorator 