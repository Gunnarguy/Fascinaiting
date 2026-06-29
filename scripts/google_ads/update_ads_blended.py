import sys
from google.ads.googleads.client import GoogleAdsClient
from google.api_core import protobuf_helpers

CUSTOMER_ID = "4509379845"
CAMPAIGN_ID = 23970700798

# Combining Engineering + Utility Headlines
HEADLINES = [
    # Engineering
    "SwiftUI Agentic RAG Engine",
    "29-Step Retrieval Pipeline",
    "BNNS-Accelerated Vector RAG",
    "SQLite FTS5 + CoreML Search",
    "Reciprocal Rank Fusion (RRF)",
    "Cross-Encoder Reranking",
    "JSON Evidence Threads",
    "Dynamic Deep Think Loops",
    # Utility
    "Audit Vast Document Archives",
    "Synthesize Entire Libraries",
    "Tactical Knowledge Retrieval",
    "Turn PDFs Into Instant Answers",
    "Zero-Knowledge Research Engine",
    "Cross-Examine Your Own Data",
    "Deploy Intelligence Anywhere"
]

# Combining Engineering + Utility Descriptions
DESCRIPTIONS = [
    # Engineering
    "Inspect the 29-step RAG pipeline powered by CoreML and Apple Foundation Models.",
    "Orchestrate your documents with a transparent, local-first RRF hybrid search pipeline.",
    # Utility
    "Instantly cross-examine thousands of secure documents without an internet connection.",
    "Deploy an uncompromised intelligence engine for research, law, or tactical operations."
]

def create_ad_text_asset(client, text):
    ad_text_asset = client.get_type("AdTextAsset")
    ad_text_asset.text = text
    return ad_text_asset

def main(client, customer_id):
    ga_service = client.get_service("GoogleAdsService")
    ad_service = client.get_service("AdService")
    
    # 1. Fetch the ads in the campaign
    query = f"""
        SELECT
          ad_group_ad.ad.id
        FROM ad_group_ad
        WHERE campaign.id = {CAMPAIGN_ID}
          AND ad_group_ad.status != 'REMOVED'
    """
    
    search_request = client.get_type("SearchGoogleAdsRequest")
    search_request.customer_id = customer_id
    search_request.query = query

    response = ga_service.search(request=search_request)
    
    ad_ids = set()
    for row in response:
        ad_ids.add(row.ad_group_ad.ad.id)

    print(f"Found {len(ad_ids)} unique ads to update.")

    operations = []
    for ad_id in ad_ids:
        ad_operation = client.get_type("AdOperation")
        ad = ad_operation.update
        ad.resource_name = ad_service.ad_path(customer_id, ad_id)
        
        # Clear and set headlines
        ad.responsive_search_ad.headlines.extend([create_ad_text_asset(client, text) for text in HEADLINES])
        
        # Clear and set descriptions
        ad.responsive_search_ad.descriptions.extend([create_ad_text_asset(client, text) for text in DESCRIPTIONS])
        
        # Create update mask
        client.copy_from(
            ad_operation.update_mask,
            protobuf_helpers.field_mask(None, ad._pb),
        )
        operations.append(ad_operation)

    if operations:
        print("Sending blended update request to AdService...")
        mutate_response = ad_service.mutate_ads(customer_id=customer_id, operations=operations)
        for result in mutate_response.results:
            print(f"Updated Ad: {result.resource_name}")
    else:
        print("No ads found to update.")

if __name__ == "__main__":
    try:
        googleads_client = GoogleAdsClient.load_from_storage("google_ads_automation_payload/google-ads.yaml")
        main(googleads_client, CUSTOMER_ID)
    except Exception as e:
        print(f"Error: {e}")
