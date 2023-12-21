import os
import openai

openai_api_key = os.getenv('OPENAI_API_KEY')
openai.api_key = openai_api_key

response = openai.ChatCompletion.create(
  model="gpt-4-1106-preview",
  messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Translate the following English text to French: '{what time is it}'"}
    ]
)

print(response['choices'][0]['message']['content'])