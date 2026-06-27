from google.analytics import admin_v1beta
from google.oauth2 import service_account

def list_ga4_properties():
    credentials = service_account.Credentials.from_service_account_file('analytics-key.json')
    client = admin_v1beta.AnalyticsAdminServiceClient(credentials=credentials)
    
    # 1. List accounts
    accounts = client.list_accounts()
    print("GA4 Accounts and Properties:")
    print("=" * 40)
    
    for account in accounts:
        print(f"\nAccount: {account.display_name} (ID: {account.name})")
        
        # 2. List properties for each account
        request = admin_v1beta.ListPropertiesRequest(filter=f"parent:{account.name}")
        properties = client.list_properties(request=request)
        
        for prop in properties:
            print(f"  - Property: {prop.display_name} (ID: {prop.name})")
            
            # 3. List data streams for each property
            try:
                streams_request = admin_v1beta.ListDataStreamsRequest(parent=prop.name)
                streams = client.list_data_streams(request=streams_request)
                for stream in streams:
                    print(f"      * Data Stream: {stream.display_name} (ID: {stream.name}, Type: {stream.type_})")
            except Exception as e:
                print(f"      * Could not list streams: {e}")

if __name__ == "__main__":
    try:
        list_ga4_properties()
    except Exception as e:
        print(f"Error authenticating or calling GA4 API: {e}")
