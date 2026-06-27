import sys
from google.ads.googleads.client import GoogleAdsClient

def main(client, customer_id, campaign_id):
    ga_service = client.get_service("GoogleAdsService")
    query = f"""
        SELECT
          campaign.id,
          campaign_asset.asset,
          asset.sitelink_asset.link_text,
          asset.sitelink_asset.description1,
          asset.sitelink_asset.description2,
          asset.final_urls
        FROM campaign_asset
        WHERE campaign.id = {campaign_id}
          AND campaign_asset.field_type = 'SITELINK'
          AND campaign_asset.status != 'REMOVED'
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response = ga_service.search(request=request)
    for row in response:
        print(f"Asset: {row.campaign_asset.asset}, Text: {row.asset.sitelink_asset.link_text}, URL: {row.asset.final_urls}")

if __name__ == "__main__":
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    main(client, "4509379845", "23973944785")
