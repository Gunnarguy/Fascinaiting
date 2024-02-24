const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer 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'
  },
  body: JSON.stringify({
    model: 'codellama-70b-instruct',
    messages: [
      {role: 'system', content: 'Be precise and concise.'},
      {role: 'user', content: 'How many stars are there in our galaxy?'}
    ]
  })
};

fetch('https://api.perplexity.ai/chat/completions', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));