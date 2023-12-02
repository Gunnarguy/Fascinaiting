import requests

def chat_with_pplx(user_input, previous_messages):
    url = "https://api.perplexity.ai/chat/completions"
    payload = {
        "model": "pplx-7b-online",
        "messages": previous_messages + [
            {
                "role": "user",
                "content": user_input
            }
        ]
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer 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"
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def main():
    previous_messages = [
        {
            "role": "system",
            "content": "Be precise and concise."
        }
    ]
    print("Starting conversation with PPLX model. Type 'quit' to exit.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            break
        response = chat_with_pplx(user_input, previous_messages)
        model_response = response['choices'][0]['message']['content']
        print("PPLX:", model_response)
        previous_messages.append({"role": "user", "content": user_input})
        previous_messages.append({"role": "assistant", "content": model_response})

if __name__ == "__main__":
    main()
