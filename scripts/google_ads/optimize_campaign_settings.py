import sys
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from google.api_core import protobuf_helpers

CUSTOMER_ID = "4509379845"
SEARCH_CAMPAIGN_ID = 23970700798
PMAX_CAMPAIGN_ID = 23973944785

TRACKING_TEMPLATE = (
    "{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}"
    "&utm_adgroup={adgroupid}&utm_content={creative}&utm_keyword={keyword}"
    "&utm_device={device}&utm_placement={placement}"
)

def optimize_search_campaign_settings(client, customer_id, campaign_id):
    campaign_service = client.get_service("CampaignService")
    
    print(f"\n=== Optimizing Campaign settings for Search Campaign {campaign_id} ===")
    op = client.get_type("CampaignOperation")
    campaign = op.update
    campaign.resource_name = campaign_service.campaign_path(customer_id, campaign_id)
    
    # 1. Disable Display Expansion (Target Content Network)
    campaign.network_settings.target_content_network = False
    
    # 2. Inject URL Tracking Template
    campaign.tracking_url_template = TRACKING_TEMPLATE
    
    client.copy_from(
        op.update_mask,
        protobuf_helpers.field_mask(None, campaign._pb),
    )
    
    response = campaign_service.mutate_campaigns(customer_id=customer_id, operations=[op])
    print(f"Updated Search Campaign Settings: {response.results[0].resource_name}")
    print(" - Display Expansion: DISABLED")
    print(f" - Tracking Template: {TRACKING_TEMPLATE}")

def optimize_pmax_campaign_settings(client, customer_id, campaign_id):
    campaign_service = client.get_service("CampaignService")
    
    print(f"\n=== Optimizing Campaign settings for PMax Campaign {campaign_id} ===")
    op = client.get_type("CampaignOperation")
    campaign = op.update
    campaign.resource_name = campaign_service.campaign_path(customer_id, campaign_id)
    
    # Inject URL Tracking Template
    campaign.tracking_url_template = TRACKING_TEMPLATE
    
    client.copy_from(
        op.update_mask,
        protobuf_helpers.field_mask(None, campaign._pb),
    )
    
    response = campaign_service.mutate_campaigns(customer_id=customer_id, operations=[op])
    print(f"Updated PMax Campaign Settings: {response.results[0].resource_name}")
    print(f" - Tracking Template: {TRACKING_TEMPLATE}")

def main():
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    
    try:
        optimize_search_campaign_settings(client, CUSTOMER_ID, SEARCH_CAMPAIGN_ID)
        optimize_pmax_campaign_settings(client, CUSTOMER_ID, PMAX_CAMPAIGN_ID)
        print("\nAll 10x Google Ads dev optimizations completed successfully!")
        
    except GoogleAdsException as ex:
        print(f"Google Ads API Error: {ex}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
