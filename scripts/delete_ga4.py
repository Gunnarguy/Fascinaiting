from google.analytics import admin_v1beta
from google.oauth2 import service_account

# List of property IDs to soft-delete
PROPERTIES_TO_DELETE = [
    "436225290",  # Gumroad
    "517396135",  # OpenAssistant
    "517364901",  # Gunzino.me
    "517391206",  # Gunnarguy.me
]

def delete_ga4_properties():
    credentials = service_account.Credentials.from_service_account_file('analytics-key.json')
    client = admin_v1beta.AnalyticsAdminServiceClient(credentials=credentials)
    
    print("Starting deletion of obsolete GA4 properties...")
    print("=" * 60)
    
    for prop_id in PROPERTIES_TO_DELETE:
        name = f"properties/{prop_id}"
        print(f"Deleting property: {name}...")
        try:
            request = admin_v1beta.DeletePropertyRequest(name=name)
            client.delete_property(request=request)
            print(f"Successfully soft-deleted {name} (moved to trash).")
        except Exception as e:
            print(f"Error deleting {name}: {e}")
        print("-" * 60)

if __name__ == "__main__":
    delete_ga4_properties()
