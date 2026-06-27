import sys
from google.ads.googleads.client import GoogleAdsClient

def main(client, customer_id):
    ga_service = client.get_service("GoogleAdsService")
    query = """
        SELECT
          campaign.id,
          campaign.name,
          campaign.advertising_channel_type
        FROM campaign
        WHERE campaign.status = 'ENABLED'
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response = ga_service.search(request=request)
    for row in response:
        print(f"Campaign ID: {row.campaign.id}, Name: {row.campaign.name}, Type: {row.campaign.advertising_channel_type.name}")

    query2 = """
        SELECT
          asset_group.id,
          asset_group.name,
          asset_group.campaign
        FROM asset_group
        WHERE asset_group.status = 'ENABLED'
    """
    request2 = client.get_type("SearchGoogleAdsRequest")
    request2.customer_id = customer_id
    request2.query = query2
    response2 = ga_service.search(request=request2)
    for row in response2:
        print(f"Asset Group ID: {row.asset_group.id}, Name: {row.asset_group.name}, Campaign: {row.asset_group.campaign}")

if __name__ == "__main__":
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    main(client, "4509379845")
