import sys
from google.ads.googleads.client import GoogleAdsClient

def main(client, customer_id, campaign_id, asset_group_id):
    ga_service = client.get_service("GoogleAdsService")
    asset_group_asset_service = client.get_service("AssetGroupAssetService")
    campaign_asset_service = client.get_service("CampaignAssetService")

    bad_asset_ids = [
        "377556026504", "377656002511", "377728365366", "377728379541", "377728893237", # Headlines
        "377556538112", "377656019296", "377728862868", # Descriptions
        "377655462061" # Long Headline
    ]

    print("--- 1. Purging Bad Text Assets from Asset Group ---")
    query = f"""
        SELECT
          asset_group_asset.resource_name,
          asset_group_asset.asset
        FROM asset_group_asset
        WHERE asset_group.id = {asset_group_id}
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response = ga_service.search(request=request)

    aga_ops = []
    for row in response:
        asset_id = row.asset_group_asset.asset.split('/')[-1]
        if asset_id in bad_asset_ids:
            print(f"Queueing remove for: {row.asset_group_asset.resource_name}")
            op = client.get_type("AssetGroupAssetOperation")
            op.remove = row.asset_group_asset.resource_name
            aga_ops.append(op)
    
    if aga_ops:
        try:
            asset_group_asset_service.mutate_asset_group_assets(customer_id=customer_id, operations=aga_ops)
            print("Successfully purged bad text assets.")
        except Exception as e:
            print(f"Error purging text assets: {e}")
    else:
        print("No bad text assets found to remove.")

    print("\n--- 2. Purging Bad Sitelinks from Campaign ---")
    bad_sitelink_ids = ['239689610777', '241170389002']
    query_ca = f"""
        SELECT campaign.id, campaign_asset.resource_name, campaign_asset.asset
        FROM campaign_asset
        WHERE campaign.id = {campaign_id}
          AND campaign_asset.field_type = 'SITELINK'
          AND campaign_asset.status != 'REMOVED'
    """
    request_ca = client.get_type("SearchGoogleAdsRequest")
    request_ca.customer_id = customer_id
    request_ca.query = query_ca
    response_ca = ga_service.search(request=request_ca)
    
    ca_ops = []
    for row in response_ca:
        asset_id = row.campaign_asset.asset.split('/')[-1]
        if asset_id in bad_sitelink_ids:
            print(f"Queueing remove for sitelink: {row.campaign_asset.resource_name}")
            op = client.get_type("CampaignAssetOperation")
            op.remove = row.campaign_asset.resource_name
            ca_ops.append(op)
    
    if ca_ops:
        try:
            campaign_asset_service.mutate_campaign_assets(customer_id=customer_id, operations=ca_ops)
            print("Successfully purged bad sitelinks.")
        except Exception as e:
            print(f"Error purging sitelinks: {e}")
    else:
        print("No bad sitelinks found to remove.")

if __name__ == "__main__":
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    main(client, "4509379845", "23973944785", "6724803838")
