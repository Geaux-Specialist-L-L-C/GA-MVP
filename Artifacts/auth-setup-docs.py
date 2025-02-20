"""
Authentication Setup Guide
=========================

This guide provides step-by-step instructions for setting up authentication credentials
for each supported educational platform integration.

1. Google Classroom & Calendar Setup
----------------------------------

Prerequisites:
- Google Cloud Console account
- Google Workspace for Education account (for Classroom)

Steps:

1.1 Create Google Cloud Project:
```python
# Example configuration for Google services
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

class GoogleAuthSetup:
    def __init__(self):
        self.SCOPES = [
            'https://www.googleapis.com/auth/classroom.courses',
            'https://www.googleapis.com/auth/classroom.coursework.students',
            'https://www.googleapis.com/auth/calendar'
        ]
        
    def setup_credentials(self, credentials_path: str) -> Credentials:
        '''Set up Google API credentials'''
        flow = InstalledAppFlow.from_client_secrets_file(
            credentials_path,
            self.SCOPES
        )
        credentials = flow.run_local_server(port=0)
        return credentials

# Usage example
auth_setup = GoogleAuthSetup()
credentials = auth_setup.setup_credentials('path/to/credentials.json')
```

Setup Instructions:
1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Classroom and Calendar APIs
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Desktop application"
   - Download the client configuration file
5. Save the downloaded file as 'credentials.json'

2. Khan Academy API Setup
------------------------

Prerequisites:
- Khan Academy developer account

Steps:

```python
class KhanAcademyAuth:
    def __init__(self):
        self.BASE_URL = 'https://www.khanacademy.org/api/auth2'
        
    def setup_oauth(self, consumer_key: str, consumer_secret: str):
        '''Set up Khan Academy OAuth authentication'''
        import requests
        from requests_oauthlib import OAuth1
        
        oauth = OAuth1(
            consumer_key,
            client_secret=consumer_secret,
            signature_method='HMAC-SHA1'
        )
        
        return oauth

# Usage example
khan_auth = KhanAcademyAuth()
oauth = khan_auth.setup_oauth(
    'your_consumer_key',
    'your_consumer_secret'
)
```

Setup Instructions:
1. Visit Khan Academy Developer Documentation
2. Register your application
3. Save your Consumer Key and Secret
4. Store credentials securely in environment variables:
   ```bash
   export KHAN_CONSUMER_KEY='your_key'
   export KHAN_CONSUMER_SECRET='your_secret'
   ```

3. IXL Learning API Setup
------------------------

Prerequisites:
- IXL Learning account with API access

Steps:

```python
class IXLAuth:
    def __init__(self):
        self.API_BASE_URL = 'https://api.ixl.com/v1'
        
    def generate_auth_header(
        self,
        api_key: str,
        api_secret: str
    ) -> dict:
        '''Generate IXL authentication headers'''
        import base64
        import hmac
        import hashlib
        from datetime import datetime
        
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        message = f"{api_key}:{timestamp}"
        signature = hmac.new(
            api_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return {
            'Authorization': f'IXL {api_key}:{timestamp}:{signature}',
            'Content-Type': 'application/json'
        }

# Usage example
ixl_auth = IXLAuth()
headers = ixl_auth.generate_auth_header(
    'your_api_key',
    'your_api_secret'
)
```

Setup Instructions:
1. Contact IXL Learning support for API access
2. Receive API credentials
3. Store credentials securely:
   ```bash
   export IXL_API_KEY='your_key'
   export IXL_API_SECRET='your_secret'
   ```

4. Secure Credential Management
-----------------------------

Implement secure credential storage:

```python
import os
from pathlib import Path
import json
from cryptography.fernet import Fernet

class CredentialManager:
    def __init__(self):
        self.key_file = Path('.secret/key.key')
        self.cred_file = Path('.secret/credentials.enc')
        self._ensure_secret_dir()
        
    def _ensure_secret_dir(self):
        '''Create secret directory if it doesn't exist'''
        os.makedirs('.secret', exist_ok=True)
        
    def generate_key(self):
        '''Generate encryption key'''
        key = Fernet.generate_key()
        with open(self.key_file, 'wb') as f:
            f.write(key)
        return key
        
    def load_key(self):
        '''Load existing encryption key'''
        with open(self.key_file, 'rb') as f:
            return f.read()
            
    def save_credentials(self, credentials: dict):
        '''Encrypt and save credentials'''
        if not self.key_file.exists():
            key = self.generate_key()
        else:
            key = self.load_key()
            
        f = Fernet(key)
        encrypted_data = f.encrypt(json.dumps(credentials).encode())
        
        with open(self.cred_file, 'wb') as f:
            f.write(encrypted_data)
            
    def load_credentials(self) -> dict:
        '''Load and decrypt credentials'''
        key = self.load_key()
        f = Fernet(key)
        
        with open(self.cred_file, 'rb') as file:
            encrypted_data = file.read()
            
        decrypted_data = f.decrypt(encrypted_data)
        return json.loads(decrypted_data)

# Usage example
cred_manager = CredentialManager()

# Save credentials
credentials = {
    'google': {
        'client_id': 'your_client_id',
        'client_secret': 'your_client_secret'
    },
    'khan_academy': {
        'consumer_key': 'your_consumer_key',
        'consumer_secret': 'your_consumer_secret'
    },
    'ixl': {
        'api_key': 'your_api_key',
        'api_secret': 'your_api_secret'
    }
}

cred_manager.save_credentials(credentials)

# Load credentials
stored_credentials = cred_manager.load_credentials()
```

5. Environment Setup
-------------------

Create a secure configuration file:

```python
# config.py
import os
from pathlib import Path

class Config:
    # Base paths
    BASE_DIR = Path(__file__).parent
    CREDENTIALS_DIR = BASE_DIR / '.credentials'
    
    # Google API settings
    GOOGLE_CREDENTIALS_PATH = CREDENTIALS_DIR / 'google_credentials.json'
    
    # Khan Academy settings
    KHAN_ACADEMY_CONSUMER_KEY = os.getenv('KHAN_CONSUMER_KEY')
    KHAN_ACADEMY_CONSUMER_SECRET = os.getenv('KHAN_CONSUMER_SECRET')
    
    # IXL settings
    IXL_API_KEY = os.getenv('IXL_API_KEY')
    IXL_API_SECRET = os.getenv('IXL_API_SECRET')
    
    @classmethod
    def setup(cls):
        '''Ensure required directories exist'''
        cls.CREDENTIALS_DIR.mkdir(parents=True, exist_ok=True)
```

6. Security Best Practices
-------------------------

1. Never commit credentials to version control:
   ```gitignore
   # .gitignore
   .credentials/
   .secret/
   *.key
   *.enc
   .env
   ```

2. Use environment variables for sensitive data:
   ```bash
   # .env
   KHAN_CONSUMER_KEY=your_key
   KHAN_CONSUMER_SECRET=your_secret
   IXL_API_KEY=your_key
   IXL_API_SECRET=your_secret
   ```

3. Implement credential rotation:
```python
from datetime import datetime, timedelta

class CredentialRotation:
    def __init__(self, cred_manager: CredentialManager):
        self.cred_manager = cred_manager
        
    def should_rotate(self, last_rotation: datetime) -> bool:
        '''Check if credentials should be rotated'''
        rotation_interval = timedelta(days=90)
        return datetime.now() - last_rotation > rotation_interval
        
    def rotate_credentials(self):
        '''Implement credential rotation logic'''
        # Platform-specific rotation logic here
        pass
```

7. Troubleshooting
-----------------

Common Issues and Solutions:

1. Google API Authentication Errors:
   - Ensure correct OAuth scopes
   - Check credential expiration
   - Verify project API enablement

2. Khan Academy API Issues:
   - Validate consumer key and secret
   - Check API request rate limits
   - Verify OAuth signature generation

3. IXL API Problems:
   - Confirm API access is active
   - Check timestamp synchronization
   - Verify HMAC signature calculation

For all platforms:
- Monitor API quotas and limits
- Implement exponential backoff for retries
- Log authentication attempts for debugging

8. Additional Resources
----------------------

Documentation Links:
- Google API Console: https://console.cloud.google.com/
- Khan Academy API: https://api-explorer.khanacademy.org/
- IXL Learning API: Contact IXL support

Support Channels:
- Google Cloud Support
- Khan Academy Developer Forum
- IXL Learning Support Portal
"""