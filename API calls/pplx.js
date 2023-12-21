const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer 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'
    },
    body: JSON.stringify({
      model: 'pplx-70b-online',
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