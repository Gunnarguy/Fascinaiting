import os
import json
import requests
from datetime import datetime

NOTION_API_KEY = os.environ.get("NOTION_API_KEY")
DATABASE_ID = "37f49a74-d54f-81b7-9424-dae1288c0043"
OUTPUT_FILE = "roadmap.json"

def fetch_page_content(page_id, headers):
    url = f"https://api.notion.com/v1/blocks/{page_id}/children"
    try:
        res = requests.get(url, headers=headers)
        if res.status_code != 200:
            return ""
        blocks = res.json().get("results", [])
        text_content = []
        for block in blocks:
            b_type = block.get("type")
            b_data = block.get(b_type, {})
            rich_text = b_data.get("rich_text", [])
            if not rich_text:
                continue
            text = "".join(t.get("plain_text", "") for t in rich_text)
            if b_type.startswith("heading_1"):
                text_content.append(f"# {text}")
            elif b_type.startswith("heading_2"):
                text_content.append(f"## {text}")
            elif b_type.startswith("heading_3"):
                text_content.append(f"### {text}")
            elif b_type == "paragraph":
                text_content.append(text)
            elif b_type == "bulleted_list_item":
                text_content.append(f"• {text}")
            elif b_type == "numbered_list_item":
                text_content.append(f"1. {text}")
        return "\n\n".join(text_content)
    except Exception as e:
        print(f"Error fetching page content: {e}")
        return ""

def fetch_roadmap():
    if not NOTION_API_KEY:
        print("Error: NOTION_API_KEY environment variable not set.")
        return

    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
    }

    # Optional: we can sort by Priority or Status if needed.
    # We will just fetch all and sort in JS or sort here.
    payload = {
        "page_size": 100
    }

    print("Fetching from Notion API...")
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code != 200:
        print(f"Failed to fetch data: {response.status_code}")
        print(response.text)
        return

    data = response.json()
    items = []

    for page in data.get("results", []):
        props = page.get("properties", {})
        
        # Name
        name_prop = props.get("Name", {}).get("title", [])
        name = name_prop[0].get("plain_text", "") if name_prop else "Untitled"
        
        # Status
        status_prop = props.get("Status", {}).get("select", {})
        status = status_prop.get("name", "To Do") if status_prop else "To Do"
        
        # Target OS
        os_prop = props.get("Target OS", {}).get("select", {})
        target_os = os_prop.get("name", "All") if os_prop else "All"
        
        # Priority
        priority_prop = props.get("Priority", {}).get("select", {})
        priority = priority_prop.get("name", "Low") if priority_prop else "Low"

        # Component
        comp_prop = props.get("Component", {}).get("select", {})
        component = comp_prop.get("name", "General") if comp_prop else "General"

        # Target Release
        rel_prop = props.get("Target Release", {}).get("select", {})
        target_release = rel_prop.get("name", "Future Backlog") if rel_prop else "Future Backlog"

        description = fetch_page_content(page.get("id"), headers)

        completed_prop = props.get("Completed", {}).get("date", {}) if props.get("Completed") else None
        completed_date = completed_prop.get("start") if completed_prop else None
        if not completed_date and status == "Completed":
            completed_date = page.get("last_edited_time")

        items.append({
            "id": page.get("id"),
            "name": name,
            "status": status,
            "target_os": target_os,
            "priority": priority,
            "component": component,
            "target_release": target_release,
            "description": description,
            "added_date": page.get("created_time"),
            "completed_date": completed_date
        })

    # Sort items by status: In Progress -> To Do -> Completed
    status_order = {"In Progress": 0, "To Do": 1, "Completed": 2}
    items.sort(key=lambda x: status_order.get(x["status"], 99))

    output_data = {
        "last_updated": datetime.utcnow().isoformat() + "Z",
        "items": items
    }

    with open(OUTPUT_FILE, "w") as f:
        json.dump(output_data, f, indent=2)

    print(f"Successfully synced {len(items)} roadmap items to {OUTPUT_FILE}")

if __name__ == "__main__":
    fetch_roadmap()
