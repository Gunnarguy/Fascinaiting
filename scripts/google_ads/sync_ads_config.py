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

def sync_sitelinks(client, customer_id, target_sitelinks, campaign_ids):
    asset_service = client.get_service("AssetService")
    campaign_asset_service = client.get_service("CampaignAssetService")
    ga_service = client.get_service("GoogleAdsService")
    
    print("\n--- Syncing Sitelinks ---")
    
    # 1. Fetch all existing enabled sitelink assets on the account to match
    print("Fetching existing sitelinks in account...")
    query_assets = """
        SELECT 
          asset.id, 
          asset.resource_name, 
          asset.sitelink_asset.link_text, 
          asset.final_urls
        FROM asset
        WHERE asset.type = 'SITELINK'
    """
    request_assets = client.get_type("SearchGoogleAdsRequest")
    request_assets.customer_id = customer_id
    request_assets.query = query_assets
    response_assets = ga_service.search(request=request_assets)
    
    existing_map = {} # (text, final_url) -> resource_name
    for row in response_assets:
        text = row.asset.sitelink_asset.link_text
        urls = list(row.asset.final_urls)
        url = urls[0] if urls else ""
        if text and url:
            existing_map[(text, url)] = row.asset.resource_name
            
    # 2. Identify resource names for all target sitelinks, creating missing ones
    target_resource_names = []
    assets_to_create = []
    
    for link in target_sitelinks:
        text = link["text"]
        url = link["final_url"]
        desc1 = link.get("description1", "")
        desc2 = link.get("description2", "")
        
        # Verify length limits (Text: 25, Description 1 & 2: 35)
        if len(text) > 25:
            print(f"Error: Sitelink text '{text}' exceeds the 25-character limit. Aborting.")
            sys.exit(1)
        if len(desc1) > 35 or len(desc2) > 35:
            print(f"Error: Sitelink descriptions for '{text}' exceed 35-character limit. Aborting.")
            sys.exit(1)
            
        key = (text, url)
        if key in existing_map:
            target_resource_names.append(existing_map[key])
        else:
            # Create operation
            print(f"Sitelink '{text}' -> '{url}' not found. Queueing creation...")
            op = client.get_type("AssetOperation")
            asset = op.create
            asset.sitelink_asset.link_text = text
            asset.sitelink_asset.description1 = desc1
            asset.sitelink_asset.description2 = desc2
            asset.final_urls.append(url)
            assets_to_create.append((key, op))
            
    if assets_to_create:
        print(f"Creating {len(assets_to_create)} new sitelink assets...")
        mutate_response = asset_service.mutate_assets(
            customer_id=customer_id, 
            operations=[op for key, op in assets_to_create]
        )
        for (key, op), result in zip(assets_to_create, mutate_response.results):
            print(f"Created sitelink: {result.resource_name}")
            existing_map[key] = result.resource_name
            target_resource_names.append(result.resource_name)
            
    # 3. Align links for each campaign
    ca_operations = []
    
    for campaign_id in campaign_ids:
        campaign_resource_name = f"customers/{customer_id}/campaigns/{campaign_id}"
        print(f"Aligning sitelinks for Campaign ID: {campaign_id}...")
        
        # Fetch current sitelink links for this campaign
        query_links = f"""
            SELECT campaign.id, campaign_asset.resource_name, campaign_asset.asset
            FROM campaign_asset
            WHERE campaign.id = {campaign_id}
              AND campaign_asset.field_type = 'SITELINK'
              AND campaign_asset.status != 'REMOVED'
        """
        request_links = client.get_type("SearchGoogleAdsRequest")
        request_links.customer_id = customer_id
        request_links.query = query_links
        response_links = ga_service.search(request=request_links)
        
        current_linked_assets = {} # asset_rn -> campaign_asset_rn
        for row in response_links:
            current_linked_assets[row.campaign_asset.asset] = row.campaign_asset.resource_name
            
        # Unlink any currently linked assets that are NOT in target list
        for asset_rn, ca_rn in current_linked_assets.items():
            if asset_rn not in target_resource_names:
                print(f" - Queueing UNLINK for asset: {asset_rn}")
                op = client.get_type("CampaignAssetOperation")
                op.remove = ca_rn
                ca_operations.append(op)
                
        # Link any target assets that are NOT currently linked
        for target_rn in target_resource_names:
            if target_rn not in current_linked_assets:
                print(f" - Queueing LINK for asset: {target_rn}")
                op = client.get_type("CampaignAssetOperation")
                ca = op.create
                ca.campaign = campaign_resource_name
                ca.asset = target_rn
                ca.field_type = client.enums.AssetFieldTypeEnum.SITELINK
                ca_operations.append(op)
                
    if ca_operations:
        print(f"Mutating {len(ca_operations)} campaign-sitelink linkages...")
        campaign_asset_service.mutate_campaign_assets(customer_id=customer_id, operations=ca_operations)
        print("Sitelink linkages updated successfully.")
    else:
        print("Sitelinks are already perfectly aligned for all campaigns.")

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
    
    # Sync sitelinks across both active campaigns
    campaign_ids = [config["search_campaign"]["campaign_id"], config["pmax_campaign"]["campaign_id"]]
    sync_sitelinks(client, customer_id, config["sitelinks"], campaign_ids)
    
    print("\nSync complete! All campaigns and sitelinks updated.")

if __name__ == "__main__":
    main()
