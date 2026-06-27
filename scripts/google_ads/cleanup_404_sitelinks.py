import sys
from google.ads.googleads.client import GoogleAdsClient

def main(client, customer_id, campaign_id):
    ga_service = client.get_service("GoogleAdsService")
    campaign_asset_service = client.get_service("CampaignAssetService")

    print("--- Purging 404 Sitelinks from Campaign ---")
    bad_sitelink_ids = ['235822989897', '241198635072']
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
    main(client, "4509379845", "23973944785")
