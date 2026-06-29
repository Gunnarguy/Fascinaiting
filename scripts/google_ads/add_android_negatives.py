import sys
from google.ads.googleads.client import GoogleAdsClient

CUSTOMER_ID = "4509379845"
CAMPAIGN_ID = 23970700798 # OpenIntelligence_Core_V2

def main(client, customer_id, campaign_id):
    campaign_criterion_service = client.get_service("CampaignCriterionService")
    
    # List of Android-focused terms to exclude
    keywords = [
        "android", 
        "apk", 
        "play store", 
        "google play", 
        "google play store", 
        "samsung", 
        "pixel", 
        "xiaomi",
        "oneplus",
        "motorola"
    ]
    
    operations = []
    for kw in keywords:
        op = client.get_type("CampaignCriterionOperation")
        criterion = op.create
        criterion.campaign = f"customers/{customer_id}/campaigns/{campaign_id}"
        criterion.negative = True
        criterion.keyword.text = kw
        criterion.keyword.match_type = client.enums.KeywordMatchTypeEnum.BROAD
        operations.append(op)
        
    print(f"Adding negative keywords to Campaign ID: {campaign_id}...")
    response = campaign_criterion_service.mutate_campaign_criteria(
        customer_id=customer_id, 
        operations=operations
    )
    print(f"Successfully added {len(response.results)} negative keywords:")
    for res in response.results:
        print(f" - {res.resource_name}")

if __name__ == "__main__":
    try:
        googleads_client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
        main(googleads_client, CUSTOMER_ID, CAMPAIGN_ID)
    except Exception as e:
        print(f"Error: {e}")
