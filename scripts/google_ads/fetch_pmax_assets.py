import sys
from google.ads.googleads.client import GoogleAdsClient

def main(client, customer_id):
    ga_service = client.get_service("GoogleAdsService")
    query = """
        SELECT
          asset_group.id,
          asset_group_asset.asset,
          asset_group_asset.field_type,
          asset.text_asset.text,
          asset.sitelink_asset.link_text,
          asset.name
        FROM asset_group_asset
        WHERE asset_group.id = 6724803838
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response = ga_service.search(request=request)
    for row in response:
        asset_type = row.asset_group_asset.field_type.name
        text = row.asset.text_asset.text if row.asset.text_asset.text else row.asset.sitelink_asset.link_text
        print(f"Type: {asset_type}, Text: {text}, Asset ID: {row.asset_group_asset.asset}")

if __name__ == "__main__":
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    main(client, "4509379845")
