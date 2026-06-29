import sys
from google.ads.googleads.client import GoogleAdsClient

CUSTOMER_ID = "4509379845"
CAMPAIGN_IDS = [23970700798, 23973944785] # Core V2 and PMax
BAD_ASSET_IDS = ["380587964665", "380587964668"]

def main(client, customer_id):
    asset_service = client.get_service("AssetService")
    campaign_asset_service = client.get_service("CampaignAssetService")
    ga_service = client.get_service("GoogleAdsService")
    
    print("--- 1. Creating Corrected .me Sitelink Assets ---")
    
    # Sitelink 1: Fascinaiting (Corrected to .me)
    asset_op1 = client.get_type("AssetOperation")
    asset1 = asset_op1.create
    asset1.sitelink_asset.link_text = "Fascinaiting Tech Blog"
    asset1.sitelink_asset.description1 = "Read the latest tech deep dives."
    asset1.sitelink_asset.description2 = "Explore the Fascinaiting blog."
    asset1.final_urls.append("https://fascinaiting.me/")

    # Sitelink 2: Portfolio (Corrected to .me)
    asset_op2 = client.get_type("AssetOperation")
    asset2 = asset_op2.create
    asset2.sitelink_asset.link_text = "Developer Portfolio"
    asset2.sitelink_asset.description1 = "Meet the developer behind the app."
    asset2.sitelink_asset.description2 = "View projects, tools, and resume."
    asset2.final_urls.append("https://gunnarguy.me/")
    
    # Mutate to create assets
    response = asset_service.mutate_assets(
        customer_id=customer_id, 
        operations=[asset_op1, asset_op2]
    )
    new_asset_resource_names = [result.resource_name for result in response.results]
    print("Created new .me sitelinks:")
    for rn in new_asset_resource_names:
        print(f" - {rn}")

    print("\n--- 2. Linking New Sitelinks to Campaigns ---")
    link_operations = []
    for campaign_id in CAMPAIGN_IDS:
        campaign_resource_name = f"customers/{customer_id}/campaigns/{campaign_id}"
        for asset_rn in new_asset_resource_names:
            op = client.get_type("CampaignAssetOperation")
            campaign_asset = op.create
            campaign_asset.asset = asset_rn
            campaign_asset.campaign = campaign_resource_name
            campaign_asset.field_type = client.enums.AssetFieldTypeEnum.SITELINK
            link_operations.append(op)
            
    if link_operations:
        link_response = campaign_asset_service.mutate_campaign_assets(
            customer_id=customer_id, 
            operations=link_operations
        )
        print("Successfully linked new .me sitelinks:")
        for result in link_response.results:
            print(f" - {result.resource_name}")

    print("\n--- 3. Unlinking Old .com Sitelinks ---")
    # Fetch active links to identify bad ones
    query = f"""
        SELECT campaign.id, campaign_asset.resource_name, campaign_asset.asset
        FROM campaign_asset
        WHERE campaign_asset.field_type = 'SITELINK'
          AND campaign_asset.status != 'REMOVED'
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response_search = ga_service.search(request=request)
    
    unlink_operations = []
    for row in response_search:
        asset_id = row.campaign_asset.asset.split('/')[-1]
        if asset_id in BAD_ASSET_IDS:
            print(f"Queueing unlink for sitelink: {row.campaign_asset.resource_name} (Asset ID: {asset_id})")
            op = client.get_type("CampaignAssetOperation")
            op.remove = row.campaign_asset.resource_name
            unlink_operations.append(op)
            
    if unlink_operations:
        unlink_response = campaign_asset_service.mutate_campaign_assets(
            customer_id=customer_id, 
            operations=unlink_operations
        )
        print("Successfully unlinked old .com sitelinks:")
        for result in unlink_response.results:
            print(f" - {result.resource_name}")
    else:
        print("No old .com sitelinks found to unlink.")

if __name__ == "__main__":
    try:
        googleads_client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
        main(googleads_client, CUSTOMER_ID)
    except Exception as e:
        print(f"Error: {e}")
