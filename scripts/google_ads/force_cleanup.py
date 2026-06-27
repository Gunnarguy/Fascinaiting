import sys
from google.ads.googleads.client import GoogleAdsClient

def main(client, customer_id, asset_group_id):
    ga_service = client.get_service("GoogleAdsService")
    asset_group_asset_service = client.get_service("AssetGroupAssetService")

    bad_asset_ids = [
        "377556026504", "377656002511", "377728365366", "377728379541", "377728893237", # Headlines
        "377556538112", "377656019296", "377728862868", # Descriptions
        "377655462061" # Long Headline
    ]

    query = f"""
        SELECT
          asset_group_asset.resource_name,
          asset_group_asset.asset,
          asset_group_asset.status
        FROM asset_group_asset
        WHERE asset_group.id = {asset_group_id}
          AND asset_group_asset.status = 'ENABLED'
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response = ga_service.search(request=request)

    aga_ops = []
    for row in response:
        asset_id = row.asset_group_asset.asset.split('/')[-1]
        if asset_id in bad_asset_ids:
            print(f"Queueing remove for active bad asset: {row.asset_group_asset.resource_name}")
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
        print("No active bad text assets found to remove.")

if __name__ == "__main__":
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    main(client, "4509379845", "6724803838")
