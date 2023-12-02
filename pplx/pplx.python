import requests

url = "https://api.perplexity.ai/chat/completions"

payload = {
    "model": "pplx-7b-online",
    "messages": [
        {
            "role": "system",
            "content": "Be precise and concise."
        },
        {
            "role": "user",
            "content": "How many stars are there in our galaxy?"
        }
    ]
}
headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "authorization": "Bearer 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"
}

response = requests.post(url, json=payload, headers=headers)

print(response.text)