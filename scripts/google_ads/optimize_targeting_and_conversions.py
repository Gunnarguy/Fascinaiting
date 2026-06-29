import sys
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from google.api_core import protobuf_helpers

CUSTOMER_ID = "4509379845"
CAMPAIGN_IDS = [23970700798, 23973944785] # Search and PMax active campaigns
TARGET_GEO_IDS = [
    "2036", # Australia
    "2124", # Canada
    "2250", # France
    "2276", # Germany
    "2392", # Japan
    "2826", # United Kingdom
    "2840", # United States
]
UNFIRED_CONVERSION_ACTION_ID = "7658378840" # OpenIntelligence_Web_To_App_Click_V2

def add_location_targeting(client, customer_id, campaign_ids, geo_ids):
    campaign_criterion_service = client.get_service("CampaignCriterionService")
    operations = []
    
    print("\n=== Adding Geo Location Targets ===")
    for campaign_id in campaign_ids:
        campaign_resource_name = f"customers/{customer_id}/campaigns/{campaign_id}"
        print(f"Queueing 7 target locations for Campaign ID: {campaign_id}...")
        
        for geo_id in geo_ids:
            op = client.get_type("CampaignCriterionOperation")
            cc = op.create
            cc.campaign = campaign_resource_name
            cc.type_ = client.enums.CriterionTypeEnum.LOCATION
            cc.location.geo_target_constant = f"geoTargetConstants/{geo_id}"
            operations.append(op)
            
    if operations:
        print(f"Sending {len(operations)} campaign criterion mutations...")
        response = campaign_criterion_service.mutate_campaign_criteria(
            customer_id=customer_id, 
            operations=operations
        )
        for result in response.results:
            print(f"Created location target: {result.resource_name}")
        print("Geo location targets set successfully.")

def set_conversion_action_secondary(client, customer_id, conversion_action_id):
    conversion_action_service = client.get_service("ConversionActionService")
    
    print(f"\n=== Downgrading Conversion Action {conversion_action_id} to Secondary ===")
    op = client.get_type("ConversionActionOperation")
    ca = op.update
    ca.resource_name = f"customers/{customer_id}/conversionActions/{conversion_action_id}"
    ca.primary_for_goal = False
    
    client.copy_from(
        op.update_mask,
        protobuf_helpers.field_mask(None, ca._pb),
    )
    
    response = conversion_action_service.mutate_conversion_actions(
        customer_id=customer_id, 
        operations=[op]
    )
    print(f"Updated conversion action resource: {response.results[0].resource_name}")
    print("Goal optimization state set to SECONDARY successfully.")

def main():
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    
    try:
        # 1. Target Tier-1 Countries
        add_location_targeting(client, CUSTOMER_ID, CAMPAIGN_IDS, TARGET_GEO_IDS)
        
        # 2. Downgrade unfired V2 conversion to secondary
        set_conversion_action_secondary(client, CUSTOMER_ID, UNFIRED_CONVERSION_ACTION_ID)
        
        print("\nAll Google Ads optimizations completed successfully!")
        
    except GoogleAdsException as ex:
        print(f"Google Ads API Error: {ex}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
