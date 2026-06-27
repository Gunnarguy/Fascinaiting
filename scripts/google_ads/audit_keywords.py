import sys
from google.ads.googleads.client import GoogleAdsClient

CUSTOMER_ID = "4509379845"
CAMPAIGN_ID = 23970700798

def main(client, customer_id):
    ga_service = client.get_service("GoogleAdsService")
    
    query = f"""
        SELECT
          ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type,
          ad_group.name,
          ad_group_criterion.status
        FROM ad_group_criterion
        WHERE campaign.id = {CAMPAIGN_ID}
          AND ad_group_criterion.type = 'KEYWORD'
          AND ad_group_criterion.status = 'ENABLED'
    """
    
    search_request = client.get_type("SearchGoogleAdsRequest")
    search_request.customer_id = customer_id
    search_request.query = query

    response = ga_service.search(request=search_request)
    
    print("Active Keywords in Campaign:")
    print("============================")
    count = 0
    for row in response:
        match_type = row.ad_group_criterion.keyword.match_type.name
        text = row.ad_group_criterion.keyword.text
        ad_group = row.ad_group.name
        print(f"[{ad_group}] {match_type}: '{text}'")
        count += 1
        
    if count == 0:
        print("No active keywords found.")

if __name__ == "__main__":
    try:
        googleads_client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
        main(googleads_client, CUSTOMER_ID)
    except Exception as e:
        print(f"Error: {e}")
