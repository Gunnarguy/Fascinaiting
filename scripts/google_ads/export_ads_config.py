import json
from google.ads.googleads.client import GoogleAdsClient

CUSTOMER_ID = "4509379845"
SEARCH_CAMPAIGN_ID = 23970700798
PMAX_ASSET_GROUP_ID = 6724803838

def fetch_search_ads(client, customer_id):
    ga_service = client.get_service("GoogleAdsService")
    query = f"""
        SELECT
          ad_group_ad.ad.id,
          ad_group_ad.ad.responsive_search_ad.headlines,
          ad_group_ad.ad.responsive_search_ad.descriptions
        FROM ad_group_ad
        WHERE campaign.id = {SEARCH_CAMPAIGN_ID}
          AND ad_group_ad.status != 'REMOVED'
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response = ga_service.search(request=request)
    
    ads = []
    for row in response:
        headlines = [h.text for h in row.ad_group_ad.ad.responsive_search_ad.headlines]
        descriptions = [d.text for d in row.ad_group_ad.ad.responsive_search_ad.descriptions]
        ads.append({
            "ad_id": row.ad_group_ad.ad.id,
            "headlines": headlines,
            "descriptions": descriptions
        })
    return ads

def fetch_pmax_assets(client, customer_id):
    ga_service = client.get_service("GoogleAdsService")
    query = f"""
        SELECT
          asset_group.id,
          asset_group.name,
          asset_group_asset.asset,
          asset_group_asset.field_type,
          asset.text_asset.text
        FROM asset_group_asset
        WHERE asset_group.id = {PMAX_ASSET_GROUP_ID}
    """
    request = client.get_type("SearchGoogleAdsRequest")
    request.customer_id = customer_id
    request.query = query
    response = ga_service.search(request=request)
    
    headlines = []
    long_headlines = []
    descriptions = []
    business_names = []
    
    for row in response:
        field_type = row.asset_group_asset.field_type.name
        text = row.asset.text_asset.text
        if not text:
            continue
            
        asset_info = {
            "text": text,
            "asset_id": row.asset_group_asset.asset
        }
        
        if field_type == "HEADLINE":
            headlines.append(asset_info)
        elif field_type == "LONG_HEADLINE":
            long_headlines.append(asset_info)
        elif field_type == "DESCRIPTION":
            descriptions.append(asset_info)
        elif field_type == "BUSINESS_NAME":
            business_names.append(asset_info)
            
    return {
        "asset_group_id": PMAX_ASSET_GROUP_ID,
        "headlines": headlines,
        "long_headlines": long_headlines,
        "descriptions": descriptions,
        "business_names": business_names
    }

def main():
    client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
    
    print("Fetching Search campaign ads...")
    search_ads = fetch_search_ads(client, CUSTOMER_ID)
    
    print("Fetching Performance Max campaign assets...")
    pmax_assets = fetch_pmax_assets(client, CUSTOMER_ID)
    
    config = {
        "customer_id": CUSTOMER_ID,
        "search_campaign": {
            "campaign_id": SEARCH_CAMPAIGN_ID,
            "campaign_name": "OpenIntelligence_Core_V2",
            "ads": search_ads
        },
        "pmax_campaign": {
            "campaign_id": 23973944785,
            "campaign_name": "OpenIntelligence_Universal_PMax_4cdd87",
            "asset_group": pmax_assets
        }
    }
    
    output_file = "google_ads_config.json"
    with open(output_file, "w") as f:
        json.dump(config, f, indent=2)
    print(f"Exported active ad configs to {output_file}!")

if __name__ == "__main__":
    main()
