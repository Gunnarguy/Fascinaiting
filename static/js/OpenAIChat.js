import OpenAI from "openai";

const openai = new OpenAI();

// Function to display chat messages
function displayMessage(role, content) {
  const messageContainer = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add(role);
  messageElement.innerText = content;
  messageContainer.appendChild(messageElement);
}

document.getElementById("send-btn").addEventListener("click", main);

async function main() {
  // Display system message
  displayMessage("system", "You are a helpful assistant.");

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-4-1106-preview",
  });

  const reply = completion.choices[0].message.content;

  // Display assistant's reply
  displayMessage("assistant", reply);
}

main();