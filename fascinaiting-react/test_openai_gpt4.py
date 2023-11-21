import os
import openai

# Print to confirm the script has started running
print("Script started.")

# Get the OpenAI API key from the environment variable
openai_api_key = os.getenv('OPENAI_API_KEY')

# Ensure the API key is available
if openai_api_key is None:
    print("The OPENAI_API_KEY environment variable is not set.")
    exit(1)

# Set the API key for authentication
openai.api_key = openai_api_key

# Print to confirm the API key has been set
print("API key set.")

# Example function to call the OpenAI GPT-4 chat API with default settings
def get_gpt4_chat_completion(prompt, model='gpt-4-1106-preview'):
    print(f"Sending prompt to the API: {prompt}")  # Print the prompt being sent
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
            # Add other parameters as needed to customize the request
        )
        print("Received response from the API.")  # Print to confirm a response was received
        return response.choices[0].message['content']
    except openai.error.OpenAIError as e:
        # Handle OpenAI-specific errors
        print(f"An OpenAI error occurred: {e}")
    except Exception as e:
        # Handle other generic exceptions
        print(f"An error occurred: {e}")
    return None

# Example usage
if __name__ == '__main__':
    test_prompt = "Can you provide an example of a creative story?"
    completion = get_gpt4_chat_completion(test_prompt)
    if completion:
        print("Completion:")
        print(completion)
    else:
        print("No completion received from the API.")
