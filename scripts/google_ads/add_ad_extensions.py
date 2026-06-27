import sys
from google.ads.googleads.client import GoogleAdsClient

CUSTOMER_ID = "4509379845"
CAMPAIGN_ID = "23970700798"

CALLOUTS = [
    "MIT Licensed",
    "Open Source Code",
    "No Subscriptions",
    "100% Private"
]

def main(client, customer_id, campaign_id):
    asset_service = client.get_service("AssetService")
    campaign_asset_service = client.get_service("CampaignAssetService")
    campaign_service = client.get_service("CampaignService")
    campaign_resource_name = campaign_service.campaign_path(customer_id, campaign_id)
    
    print("Creating Callout Assets...")
    asset_operations = []
    for text in CALLOUTS:
        operation = client.get_type("AssetOperation")
        asset = operation.create
        asset.callout_asset.callout_text = text
        asset_operations.append(operation)

    # Structured Snippet
    snippet_operation = client.get_type("AssetOperation")
    snippet_asset = snippet_operation.create
    snippet_asset.structured_snippet_asset.header = "Types"
    snippet_asset.structured_snippet_asset.values.extend(["3B Core", "20B Advanced", "PT-MoE Cloud"])
    asset_operations.append(snippet_operation)

    # Mutate assets
    response = asset_service.mutate_assets(customer_id=customer_id, operations=asset_operations)
    asset_resource_names = [result.resource_name for result in response.results]
    print(f"Created {len(asset_resource_names)} assets.")

    print("Linking Assets to Campaign...")
    campaign_asset_operations = []
    
    # Link Callouts (all except last one)
    for rn in asset_resource_names[:-1]:
        operation = client.get_type("CampaignAssetOperation")
        campaign_asset = operation.create
        campaign_asset.asset = rn
        campaign_asset.campaign = campaign_resource_name
        campaign_asset.field_type = client.enums.AssetFieldTypeEnum.CALLOUT
        campaign_asset_operations.append(operation)
        
    # Link Structured Snippet (last one)
    snippet_op = client.get_type("CampaignAssetOperation")
    snippet_ca = snippet_op.create
    snippet_ca.asset = asset_resource_names[-1]
    snippet_ca.campaign = campaign_resource_name
    snippet_ca.field_type = client.enums.AssetFieldTypeEnum.STRUCTURED_SNIPPET
    campaign_asset_operations.append(snippet_op)

    ca_response = campaign_asset_service.mutate_campaign_assets(customer_id=customer_id, operations=campaign_asset_operations)
    print(f"Successfully linked assets to Campaign ID {campaign_id}:")
    for result in ca_response.results:
        print(f" - {result.resource_name}")

if __name__ == "__main__":
    try:
        googleads_client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
        main(googleads_client, CUSTOMER_ID, CAMPAIGN_ID)
    except Exception as e:
        print(f"Error: {e}")
