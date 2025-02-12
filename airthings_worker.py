import os
import time
import requests
from datetime import datetime, timedelta
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AirthingsWorker:
    def __init__(self):
        self.client_id = os.getenv('AIRTHINGS_CLIENT_ID')
        self.client_secret = os.getenv('AIRTHINGS_SECRET')
        self.serial_number = os.getenv('AIRTHINGS_SERIAL_NIMBER')
        self.token = None
        self.token_expires_at = None
        
        if not all([self.client_id, self.client_secret, self.serial_number]):
            raise ValueError("Missing required environment variables")

    def get_token(self):
        """Get a new access token from Airthings API"""
        url = "https://accounts-api.airthings.com/v1/token"
        payload = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "scope": ["read:device:current_values"]
        }
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            token_data = response.json()
            
            self.token = token_data['access_token']
            # Set expiration time (subtract 5 minutes for safety margin)
            self.token_expires_at = datetime.now() + timedelta(
                seconds=token_data['expires_in'] - 300
            )
            logger.info("Successfully obtained new access token")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get token: {str(e)}")
            raise

    def ensure_valid_token(self):
        """Ensure we have a valid token, refresh if necessary"""
        if (not self.token or 
            not self.token_expires_at or 
            datetime.now() >= self.token_expires_at):
            self.get_token()

    def run(self):
        """Main worker loop"""
        logger.info("Starting Airthings worker...")
        
        while True:
            try:
                self.ensure_valid_token()
                logger.info(f"Token valid until: {self.token_expires_at}")
                
                # Here you can add your actual work with the API
                # For example, getting device readings, etc.
                
                # Sleep for 5 minutes before next check
                time.sleep(300)
                
            except Exception as e:
                logger.error(f"Error in worker loop: {str(e)}")
                # Sleep for 1 minute before retry on error
                time.sleep(60)

if __name__ == "__main__":
    worker = AirthingsWorker()
    worker.run()
