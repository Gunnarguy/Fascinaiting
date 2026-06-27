import sys
from google.ads.googleads.client import GoogleAdsClient

CUSTOMER_ID = "4509379845"
CAMPAIGN_ID = "23973944785"
ASSET_GROUP_ID = "6724803838"

HEADLINES = [
    "SwiftUI Agentic RAG Engine",
    "BNNS-Accelerated Vector RAG",
    "Reciprocal Rank Fusion RRF",
    "JSON Evidence Threads",
    "Dynamic Deep Think Loops"
]

LONG_HEADLINES = [
    "Scale dynamically from the 3B Core model to Private Cloud Compute for massive contexts.",
    "Verify answers instantly with exact token packing, BM25 extraction, and cited chunks."
]

DESCRIPTIONS = [
    "Inspect the 23-step query loop powered by CoreML embeddings and Apple Foundation Models.",
    "Orchestrate your documents with a transparent, local-first RRF hybrid search pipeline."
]

def main(client, customer_id, campaign_id, asset_group_id):
    ga_service = client.get_service("GoogleAdsService")
    asset_group_asset_service = client.get_service("AssetGroupAssetService")
    asset_service = client.get_service("AssetService")
    campaign_asset_service = client.get_service("CampaignAssetService")

    # 1. Fetch old assets
    print(f"--- 1. Fetching existing text assets in Asset Group {asset_group_id} ---")
    query = f"""
        SELECT
          asset_group_asset.resource_name,
          asset_group_asset.field_type
        FROM asset_group_asset
        WHERE asset_group.id = {asset_group_id}
          AND asset_group_asset.field_type IN ('HEADLINE', 'LONG_HEADLINE', 'DESCRIPTION')
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response = ga_service.search(request=request)

    aga_operations = []
    
    # Prepare remove operations
    for row in response:
        print(f"Queueing remove for: {row.asset_group_asset.resource_name}")
        op = client.get_type("AssetGroupAssetOperation")
        op.remove = row.asset_group_asset.resource_name
        aga_operations.append(op)

    # 2. Create new assets
    print("\n--- 2. Creating New Text Assets ---")
    asset_ops = []
    for hl in HEADLINES:
        op = client.get_type("AssetOperation")
        op.create.text_asset.text = hl
        asset_ops.append(op)
    for lh in LONG_HEADLINES:
        op = client.get_type("AssetOperation")
        op.create.text_asset.text = lh
        asset_ops.append(op)
    for desc in DESCRIPTIONS:
        op = client.get_type("AssetOperation")
        op.create.text_asset.text = desc
        asset_ops.append(op)
    
    asset_response = asset_service.mutate_assets(customer_id=customer_id, operations=asset_ops)
    new_asset_resource_names = [r.resource_name for r in asset_response.results]
    print(f"Created {len(new_asset_resource_names)} new Text Assets.")

    # 3. Add create operations
    print("\n--- 3. Queueing Link Operations for New Assets ---")
    idx = 0
    for hl in HEADLINES:
        op = client.get_type("AssetGroupAssetOperation")
        op.create.asset = new_asset_resource_names[idx]
        op.create.asset_group = f"customers/{customer_id}/assetGroups/{asset_group_id}"
        op.create.field_type = client.enums.AssetFieldTypeEnum.HEADLINE
        aga_operations.append(op)
        idx += 1
    for lh in LONG_HEADLINES:
        op = client.get_type("AssetGroupAssetOperation")
        op.create.asset = new_asset_resource_names[idx]
        op.create.asset_group = f"customers/{customer_id}/assetGroups/{asset_group_id}"
        op.create.field_type = client.enums.AssetFieldTypeEnum.LONG_HEADLINE
        aga_operations.append(op)
        idx += 1
    for desc in DESCRIPTIONS:
        op = client.get_type("AssetGroupAssetOperation")
        op.create.asset = new_asset_resource_names[idx]
        op.create.asset_group = f"customers/{customer_id}/assetGroups/{asset_group_id}"
        op.create.field_type = client.enums.AssetFieldTypeEnum.DESCRIPTION
        aga_operations.append(op)
        idx += 1
        
    print(f"\n--- 4. Mutating Asset Group Assets (Total Ops: {len(aga_operations)}) ---")
    asset_group_asset_service.mutate_asset_group_assets(customer_id=customer_id, operations=aga_operations)
    print("Successfully replaced text assets in the Asset Group.")

    print("\n--- 5. Purging Bad Sitelinks from Campaign ---")
    bad_assets = ['239689610777', '241170389002']
    query_ca = f"""
        SELECT campaign_asset.resource_name, campaign_asset.asset
        FROM campaign_asset
        WHERE campaign.id = {campaign_id}
          AND campaign_asset.field_type = 'SITELINK'
          AND campaign_asset.status != 'REMOVED'
    """
    request_ca = client.get_type("SearchGoogleAdsRequest")
    request_ca.customer_id = customer_id
    request_ca.query = query_ca
    response_ca = ga_service.search(request=request_ca)
    
    ca_remove_ops = []
    for row in response_ca:
        asset_id = row.campaign_asset.asset.split('/')[-1]
        if asset_id in bad_assets:
            print(f"Removing bad sitelink: {row.campaign_asset.resource_name}")
            op = client.get_type("CampaignAssetOperation")
            op.remove = row.campaign_asset.resource_name
            ca_remove_ops.append(op)
    
    if ca_remove_ops:
        campaign_asset_service.mutate_campaign_assets(customer_id=customer_id, operations=ca_remove_ops)
        print("Bad sitelinks removed.")
    else:
        print("No bad sitelinks found to remove.")

    print("\nUpdate complete!")

if __name__ == "__main__":
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    main(client, CUSTOMER_ID, CAMPAIGN_ID, ASSET_GROUP_ID)
