import sys
from google.ads.googleads.client import GoogleAdsClient

CUSTOMER_ID = "4509379845"
CAMPAIGN_ID = "23970700798" # OpenIntelligence_Core_V2

def main(client, customer_id, campaign_id):
    asset_service = client.get_service("AssetService")
    campaign_asset_service = client.get_service("CampaignAssetService")
    campaign_service = client.get_service("CampaignService")
    
    print("Creating Sitelink Assets...")
    
    # 1. Create Sitelink 1: Fascinaiting
    asset_operation1 = client.get_type("AssetOperation")
    asset1 = asset_operation1.create
    asset1.sitelink_asset.link_text = "Fascinaiting Tech Blog"
    asset1.sitelink_asset.description1 = "Read the latest tech deep dives."
    asset1.sitelink_asset.description2 = "Explore the Fascinaiting blog."
    asset1.final_urls.append("https://fascinaiting.com/")

    # 2. Create Sitelink 2: Portfolio
    asset_operation2 = client.get_type("AssetOperation")
    asset2 = asset_operation2.create
    asset2.sitelink_asset.link_text = "Developer Portfolio"
    asset2.sitelink_asset.description1 = "Meet the developer behind the app."
    asset2.sitelink_asset.description2 = "View projects, tools, and resume."
    asset2.final_urls.append("https://gunnarguy.com/")
    
    # Mutate assets
    response = asset_service.mutate_assets(customer_id=customer_id, operations=[asset_operation1, asset_operation2])
    asset_resource_names = [result.resource_name for result in response.results]
    print(f"Created assets:")
    for rn in asset_resource_names:
        print(f" - {rn}")

    print("Linking Sitelink Assets to Campaign...")
    # 3. Link them to the Campaign
    campaign_asset_operations = []
    campaign_resource_name = campaign_service.campaign_path(customer_id, campaign_id)
    
    for resource_name in asset_resource_names:
        operation = client.get_type("CampaignAssetOperation")
        campaign_asset = operation.create
        campaign_asset.asset = resource_name
        campaign_asset.campaign = campaign_resource_name
        campaign_asset.field_type = client.enums.AssetFieldTypeEnum.SITELINK
        campaign_asset_operations.append(operation)

    ca_response = campaign_asset_service.mutate_campaign_assets(customer_id=customer_id, operations=campaign_asset_operations)
    print(f"Successfully linked assets to Campaign ID {campaign_id}:")
    for result in ca_response.results:
        print(f" - {result.resource_name}")

if __name__ == "__main__":
    try:
        # Assuming run from Fascinaiting root
        googleads_client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
        main(googleads_client, CUSTOMER_ID, CAMPAIGN_ID)
    except Exception as e:
        print(f"Error: {e}")
