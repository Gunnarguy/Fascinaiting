import json
import sys
from google.ads.googleads.client import GoogleAdsClient
from google.api_core import protobuf_helpers

def create_ad_text_asset(client, text):
    ad_text_asset = client.get_type("AdTextAsset")
    ad_text_asset.text = text
    return ad_text_asset

def sync_search_ads(client, customer_id, search_campaign_config):
    campaign_id = search_campaign_config["campaign_id"]
    ad_service = client.get_service("AdService")
    
    print(f"--- Syncing Search Ads for Campaign ID: {campaign_id} ---")
    operations = []
    
    for ad_config in search_campaign_config["ads"]:
        ad_id = ad_config["ad_id"]
        headlines = ad_config["headlines"]
        descriptions = ad_config["descriptions"]
        
        # Verify length constraints (Headlines: 30 chars, Descriptions: 90 chars)
        for hl in headlines:
            if len(hl) > 30:
                print(f"Error: Headline '{hl}' exceeds the 30-character limit ({len(hl)} chars). Aborting.")
                sys.exit(1)
        for desc in descriptions:
            if len(desc) > 90:
                print(f"Error: Description '{desc}' exceeds the 90-character limit ({len(desc)} chars). Aborting.")
                sys.exit(1)
                
        ad_operation = client.get_type("AdOperation")
        ad = ad_operation.update
        ad.resource_name = ad_service.ad_path(customer_id, ad_id)
        
        ad.responsive_search_ad.headlines.extend([create_ad_text_asset(client, text) for text in headlines])
        ad.responsive_search_ad.descriptions.extend([create_ad_text_asset(client, text) for text in descriptions])
        
        client.copy_from(
            ad_operation.update_mask,
            protobuf_helpers.field_mask(None, ad._pb),
        )
        operations.append(ad_operation)
        
    if operations:
        print(f"Sending search ad updates to AdService for {len(operations)} ads...")
        ad_service.mutate_ads(customer_id=customer_id, operations=operations)
        print("Search ads updated successfully.")

def sync_pmax_assets(client, customer_id, pmax_campaign_config):
    campaign_id = pmax_campaign_config["campaign_id"]
    asset_group_config = pmax_campaign_config["asset_group"]
    asset_group_id = asset_group_config["asset_group_id"]
    
    ga_service = client.get_service("GoogleAdsService")
    asset_group_asset_service = client.get_service("AssetGroupAssetService")
    asset_service = client.get_service("AssetService")
    
    print(f"\n--- Syncing PMax Assets for Asset Group: {asset_group_id} ---")
    
    # 1. Fetch current text assets to remove
    print("Fetching active text assets in Asset Group...")
    query = f"""
        SELECT
          asset_group_asset.resource_name,
          asset_group_asset.field_type
        FROM asset_group_asset
        WHERE asset_group.id = {asset_group_id}
          AND asset_group_asset.status != 'REMOVED'
          AND asset_group_asset.field_type IN ('HEADLINE', 'LONG_HEADLINE', 'DESCRIPTION')
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response = ga_service.search(request=request)
    
    aga_operations = []
    for row in response:
        print(f"Queueing remove for: {row.asset_group_asset.resource_name}")
        op = client.get_type("AssetGroupAssetOperation")
        op.remove = row.asset_group_asset.resource_name
        aga_operations.append(op)
        
    # Extract text values from JSON config
    headlines = [item["text"] for item in asset_group_config["headlines"]]
    long_headlines = [item["text"] for item in asset_group_config["long_headlines"]]
    descriptions = [item["text"] for item in asset_group_config["descriptions"]]
    
    # Verify PMax length constraints (Headlines: 30 chars, Long Headlines: 90 chars, Descriptions: 90 chars)
    for hl in headlines:
        if len(hl) > 30:
            print(f"Error: Headline '{hl}' exceeds the 30-character limit ({len(hl)} chars). Aborting.")
            sys.exit(1)
    for lh in long_headlines:
        if len(lh) > 90:
            print(f"Error: Long Headline '{lh}' exceeds the 90-character limit ({len(lh)} chars). Aborting.")
            sys.exit(1)
    for desc in descriptions:
        if len(desc) > 90:
            print(f"Error: Description '{desc}' exceeds the 90-character limit ({len(desc)} chars). Aborting.")
            sys.exit(1)
            
    # 2. Create new text assets
    print("\nCreating new text assets...")
    asset_ops = []
    for hl in headlines:
        op = client.get_type("AssetOperation")
        op.create.text_asset.text = hl
        asset_ops.append(op)
    for lh in long_headlines:
        op = client.get_type("AssetOperation")
        op.create.text_asset.text = lh
        asset_ops.append(op)
    for desc in descriptions:
        op = client.get_type("AssetOperation")
        op.create.text_asset.text = desc
        asset_ops.append(op)
        
    asset_response = asset_service.mutate_assets(customer_id=customer_id, operations=asset_ops)
    new_asset_resource_names = [r.resource_name for r in asset_response.results]
    print(f"Created {len(new_asset_resource_names)} new Text Assets.")
    
    # 3. Add link operations
    print("\nQueueing link operations for new assets...")
    idx = 0
    asset_group_resource_name = f"customers/{customer_id}/assetGroups/{asset_group_id}"
    
    for hl in headlines:
        op = client.get_type("AssetGroupAssetOperation")
        op.create.asset = new_asset_resource_names[idx]
        op.create.asset_group = asset_group_resource_name
        op.create.field_type = client.enums.AssetFieldTypeEnum.HEADLINE
        aga_operations.append(op)
        idx += 1
    for lh in long_headlines:
        op = client.get_type("AssetGroupAssetOperation")
        op.create.asset = new_asset_resource_names[idx]
        op.create.asset_group = asset_group_resource_name
        op.create.field_type = client.enums.AssetFieldTypeEnum.LONG_HEADLINE
        aga_operations.append(op)
        idx += 1
    for desc in descriptions:
        op = client.get_type("AssetGroupAssetOperation")
        op.create.asset = new_asset_resource_names[idx]
        op.create.asset_group = asset_group_resource_name
        op.create.field_type = client.enums.AssetFieldTypeEnum.DESCRIPTION
        aga_operations.append(op)
        idx += 1
        
    print(f"\nMutating Asset Group Assets (Total Ops: {len(aga_operations)}) ---")
    asset_group_asset_service.mutate_asset_group_assets(customer_id=customer_id, operations=aga_operations)
    print("Successfully synced text assets in the PMax Asset Group.")

def main():
    # Load configuration
    config_file = "google_ads_config.json"
    with open(config_file, "r") as f:
        config = json.load(f)
        
    customer_id = config["customer_id"]
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    
    # Sync search campaign
    sync_search_ads(client, customer_id, config["search_campaign"])
    
    # Sync PMax campaign
    sync_pmax_assets(client, customer_id, config["pmax_campaign"])
    
    print("\nSync complete! All live campaigns updated.")

if __name__ == "__main__":
    main()
