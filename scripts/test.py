from openai import OpenAI

client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key="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",
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Say this is a test",
        }
    ],
    model="gpt-4-1106-preview",
)