import redis
from typing import Dict, List, Optional
import json
from datetime import timedelta
import hashlib
from sentence_transformers import SentenceTransformer
import numpy as np
from functools import lru_cache

class StandardsCache:
    def __init__(
        self, 
        host: str = 'localhost', 
        port: int = 6379, 
        db: int = 0,
        expire_time: int = 86400  # 24 hours in seconds
    ):
        """
        Initialize the standards cache with Redis connection.
        
        Args:
            host: Redis host address
            port: Redis port number
            db: Redis database number
            expire_time: Cache expiration time in seconds
        """
        self.redis_client = redis.Redis(
            host=host,
            port=port,
            db=db,
            decode_responses=True,
            socket_timeout=5
        )
        self.expire_time = expire_time
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
    
    def _generate_key(self, content: str, grade: int) -> str:
        """Generate a unique cache key based on content and grade."""
        content_hash = hashlib.md5(content.encode()).hexdigest()
        return f"standard:g{grade}:{content_hash}"
    
    @lru_cache(maxsize=1000)
    def _encode_content(self, content: str) -> np.ndarray:
        """Encode content using sentence transformer with local caching."""
        return self.model.encode(content)
    
    def get_standard(self, content: str, grade: int) -> Optional[Dict]:
        """
        Retrieve standard alignment from cache.
        
        Args:
            content: The educational content to align
            grade: Grade level (K-12)
            
        Returns:
            Cached standard alignment or None if not found
        """
        key = self._generate_key(content, grade)
        
        try:
            cached_data = self.redis_client.get(key)
            if cached_data:
                return json.loads(cached_data)
            return None
        except redis.RedisError as e:
            print(f"Redis error in get_standard: {e}")
            return None
    
    def set_standard(self, content: str, grade: int, standard: Dict) -> bool:
        """
        Store standard alignment in cache.
        
        Args:
            content: The educational content
            grade: Grade level
            standard: Standard alignment data
            
        Returns:
            Boolean indicating success
        """
        key = self._generate_key(content, grade)
        
        try:
            return self.redis_client.setex(
                key,
                self.expire_time,
                json.dumps(standard)
            )
        except redis.RedisError as e:
            print(f"Redis error in set_standard: {e}")
            return False
    
    def align_to_standard(self, content: str, grade: int) -> Dict:
        """
        Get standard alignment with caching.
        
        Args:
            content: Educational content to align
            grade: Grade level
            
        Returns:
            Standard alignment data
        """
        # Check cache first
        cached_standard = self.get_standard(content, grade)
        if cached_standard:
            return cached_standard
            
        # Cache miss - compute new alignment
        try:
            content_vector = self._encode_content(content)
            standard_embeddings = self._load_standard_vectors(grade)
            
            # Compute similarity and get best match
            similarities = np.dot(standard_embeddings, content_vector)
            best_match_idx = np.argmax(similarities)
            
            standard = self._get_standard_by_index(best_match_idx, grade)
            
            # Cache the result
            self.set_standard(content, grade, standard)
            
            return standard
            
        except Exception as e:
            print(f"Error in align_to_standard: {e}")
            return {}
    
    def _load_standard_vectors(self, grade: int) -> np.ndarray:
        """Load pre-computed standard vectors for given grade."""
        cache_key = f"standard_vectors:g{grade}"
        
        try:
            cached_vectors = self.redis_client.get(cache_key)
            if cached_vectors:
                return np.frombuffer(cached_vectors)
            
            # Cache miss - load from database and cache
            vectors = self._load_vectors_from_db(grade)
            self.redis_client.setex(
                cache_key,
                self.expire_time,
                vectors.tobytes()
            )
            return vectors
            
        except redis.RedisError as e:
            print(f"Redis error in _load_standard_vectors: {e}")
            return self._load_vectors_from_db(grade)
    
    def clear_cache(self, grade: Optional[int] = None):
        """
        Clear standards cache.
        
        Args:
            grade: Optional grade level to clear specific cache
        """
        try:
            if grade is not None:
                pattern = f"standard:g{grade}:*"
            else:
                pattern = "standard:*"
                
            keys = self.redis_client.keys(pattern)
            if keys:
                self.redis_client.delete(*keys)
                
        except redis.RedisError as e:
            print(f"Redis error in clear_cache: {e}")

# Example usage
if __name__ == "__main__":
    # Initialize cache with custom settings
    cache = StandardsCache(
        host='localhost',
        port=6379,
        expire_time=timedelta(hours=12).seconds
    )
    
    # Example content
    content = "Students will learn about photosynthesis and cellular respiration..."
    grade = 7
    
    # Get cached or computed standard alignment
    standard = cache.align_to_standard(content, grade)
    
    print(f"Aligned Standard: {standard}")
