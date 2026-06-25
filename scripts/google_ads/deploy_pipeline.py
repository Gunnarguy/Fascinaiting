import os
import json
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

def run_automated_staging(customer_id, target_dir):
    manifest_file = os.path.join(target_dir, "manifests/campaign_manifest.json")
    with open(manifest_file, "r") as src:
        data = json.load(src)

    try:
        print("Attempting to load Google Ads credentials from storage...")
        yaml_path = os.path.join(target_dir, "google-ads.yaml")
        client = GoogleAdsClient.load_from_storage(yaml_path, version="v24")

        # 1. Establish the Micro-Budget Baseline ($0.50/day = 500,000 micros)
        budget_service = client.get_service("CampaignBudgetService")
        budget_op = client.get_type("CampaignBudgetOperation")
        budget = budget_op.create
        budget.name = "OpenIntelligence_Micro_Budget_Core_V2"
        budget.amount_micros = 500000
        budget.delivery_method = client.enums.BudgetDeliveryMethodEnum.STANDARD
        budget_res = budget_service.mutate_campaign_budgets(customer_id=customer_id, operations=[budget_op])
        budget_id = budget_res.results[0].resource_name

        # 2. Build the Search Campaign Container
        camp_service = client.get_service("CampaignService")
        camp_op = client.get_type("CampaignOperation")
        campaign = camp_op.create
        campaign.name = "OpenIntelligence_Core_V2"
        campaign.advertising_channel_type = client.enums.AdvertisingChannelTypeEnum.SEARCH
        campaign.status = client.enums.CampaignStatusEnum.ENABLED
        campaign.campaign_budget = budget_id
        campaign.manual_cpc.enhanced_cpc_enabled = False
        campaign.contains_eu_political_advertising = client.enums.EuPoliticalAdvertisingStatusEnum.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING
        camp_res = camp_service.mutate_campaigns(customer_id=customer_id, operations=[camp_op])
        campaign_id = camp_res.results[0].resource_name
        print(f"Created Campaign: {campaign_id}")

        # -------------------------------------------------------------------
        # 3. Ad Group 1: App Store Traffic
        # -------------------------------------------------------------------
        ag_service = client.get_service("AdGroupService")
        ag_op1 = client.get_type("AdGroupOperation")
        ad_group1 = ag_op1.create
        ad_group1.name = "App_Store_Traffic_V1"
        ad_group1.campaign = campaign_id
        ad_group1.status = client.enums.AdGroupStatusEnum.ENABLED
        ad_group1.cpc_bid_micros = 20000 
        ag_res1 = ag_service.mutate_ad_groups(customer_id=customer_id, operations=[ag_op1])
        ag1_id = ag_res1.results[0].resource_name

        ad_group_ad_service = client.get_service("AdGroupAdService")
        ad_op1 = client.get_type("AdGroupAdOperation")
        ad1 = ad_op1.create
        ad1.ad_group = ag1_id
        ad1.status = client.enums.AdGroupAdStatusEnum.ENABLED

        for text in ["On-Device Apple Intelligence", "Private Local AI on iOS", "Agentic Reasoning in Swift", "Zero-Dependency RAG Engine"]:
            headline = client.get_type("AdTextAsset")
            headline.text = text
            ad1.ad.responsive_search_ad.headlines.append(headline)

        for text in ["Experience a fully local 3B-parameter foundation model with agentic reasoning on iOS.", "Download OpenIntelligence on the App Store. Metal SIMD4 accelerated local AI workflows."]:
            description = client.get_type("AdTextAsset")
            description.text = text
            ad1.ad.responsive_search_ad.descriptions.append(description)

        ad1.ad.final_urls.append("https://apps.apple.com/us/app/openintelligence/id6756559175")
        ad_group_ad_service.mutate_ad_group_ads(customer_id=customer_id, operations=[ad_op1])

        # Inject Keywords for App Store
        criterion_service = client.get_service("AdGroupCriterionService")
        kw_ops1 = []
        for term in data["app_store_keywords"]:
            op = client.get_type("AdGroupCriterionOperation")
            crit = op.create
            crit.ad_group = ag1_id
            crit.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
            crit.keyword.text = term.replace("[", "").replace("]", "")
            crit.keyword.match_type = client.enums.KeywordMatchTypeEnum.EXACT
            crit.cpc_bid_micros = 20000
            kw_ops1.append(op)
        criterion_service.mutate_ad_group_criteria(customer_id=customer_id, operations=kw_ops1)

        # -------------------------------------------------------------------
        # 4. Ad Group 2: GitHub Open Source Traffic
        # -------------------------------------------------------------------
        ag_op2 = client.get_type("AdGroupOperation")
        ad_group2 = ag_op2.create
        ad_group2.name = "GitHub_Traffic_V1"
        ad_group2.campaign = campaign_id
        ad_group2.status = client.enums.AdGroupStatusEnum.ENABLED
        ad_group2.cpc_bid_micros = 20000 
        ag_res2 = ag_service.mutate_ad_groups(customer_id=customer_id, operations=[ag_op2])
        ag2_id = ag_res2.results[0].resource_name

        ad_op2 = client.get_type("AdGroupAdOperation")
        ad2 = ad_op2.create
        ad2.ad_group = ag2_id
        ad2.status = client.enums.AdGroupAdStatusEnum.ENABLED

        for text in ["SwiftUI Agentic RAG Code", "Open Source Apple AI Model", "Explore Metal SIMD4 Code", "Swift 6 Local AI Workspace"]:
            headline = client.get_type("AdTextAsset")
            headline.text = text
            ad2.ad.responsive_search_ad.headlines.append(headline)

        for text in ["Examine the source code for an autonomous local AI workspace built entirely in Swift 6.", "Fork the repo to see how SQLite FTS5 and Vision OCR bypass standard context windows."]:
            description = client.get_type("AdTextAsset")
            description.text = text
            ad2.ad.responsive_search_ad.descriptions.append(description)

        ad2.ad.final_urls.append("https://github.com/Gunnarguy/OpenIntelligence")
        ad_group_ad_service.mutate_ad_group_ads(customer_id=customer_id, operations=[ad_op2])

        # Inject Keywords for GitHub
        kw_ops2 = []
        for term in data["github_keywords"]:
            op = client.get_type("AdGroupCriterionOperation")
            crit = op.create
            crit.ad_group = ag2_id
            crit.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
            crit.keyword.text = term.replace("[", "").replace("]", "")
            crit.keyword.match_type = client.enums.KeywordMatchTypeEnum.EXACT
            crit.cpc_bid_micros = 20000
            kw_ops2.append(op)
        criterion_service.mutate_ad_group_criteria(customer_id=customer_id, operations=kw_ops2)

        print(f"Pipeline integrated. Multi-ad-group campaign successfully staged.")

    except GoogleAdsException as ex:
        print(f"API Error encountered: {ex}")
    except ValueError as ve:
        print(f"Environment Variable Error: {ve}")

if __name__ == "__main__":
    cust_id = os.environ.get("GOOGLE_ADS_LOGIN_CUSTOMER_ID", "4509379845")
    run_automated_staging(customer_id=cust_id, target_dir="./google_ads_automation_payload")
