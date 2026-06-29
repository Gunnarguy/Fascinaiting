import sys
from google.ads.googleads.client import GoogleAdsClient
from google.api_core import protobuf_helpers

CUSTOMER_ID = "4509379845"
CAMPAIGN_ID = 23970700798 # OpenIntelligence_Core_V2

def main(client, customer_id, campaign_id):
    campaign_service = client.get_service("CampaignService")
    
    campaign_operation = client.get_type("CampaignOperation")
    campaign = campaign_operation.update
    campaign.resource_name = campaign_service.campaign_path(customer_id, campaign_id)
    
    # Change bidding strategy to Maximize Conversions
    # Instantiating the empty MaximizeConversions message clears the previous scheme
    maximize_conversions = client.get_type("MaximizeConversions")
    client.copy_from(campaign.maximize_conversions, maximize_conversions)
    
    # Build update mask
    client.copy_from(
        campaign_operation.update_mask,
        protobuf_helpers.field_mask(None, campaign._pb)
    )
    
    print(f"Sending campaign update request to change bidding strategy to MAXIMIZE_CONVERSIONS...")
    response = campaign_service.mutate_campaigns(
        customer_id=customer_id,
        operations=[campaign_operation]
    )
    print(f"Successfully updated Campaign: {response.results[0].resource_name}")

if __name__ == "__main__":
    try:
        googleads_client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
        main(googleads_client, CUSTOMER_ID, CAMPAIGN_ID)
    except Exception as e:
        print(f"Error: {e}")
