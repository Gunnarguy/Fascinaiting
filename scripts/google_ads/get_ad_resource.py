import sys
from google.ads.googleads.client import GoogleAdsClient

CUSTOMER_ID = "4509379845"

def main(client, customer_id):
    ga_service = client.get_service("GoogleAdsService")
    query = """
        SELECT
          ad_group_ad.ad.id,
          ad_group_ad.resource_name,
          ad_group.id
        FROM ad_group_ad
        WHERE campaign.id = 23970700798
          AND ad_group_ad.status != 'REMOVED'
    """
    
    search_request = client.get_type("SearchGoogleAdsRequest")
    search_request.customer_id = customer_id
    search_request.query = query

    response = ga_service.search(request=search_request)
    for row in response:
        print(f"Resource Name: {row.ad_group_ad.resource_name}")
        print(f"Ad ID: {row.ad_group_ad.ad.id}")
        print(f"Ad Group ID: {row.ad_group.id}")

if __name__ == "__main__":
    googleads_client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    main(googleads_client, CUSTOMER_ID)
