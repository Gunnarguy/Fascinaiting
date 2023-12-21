<form action="search.php" method="GET">
  <input type="text" name="query" placeholder="Search...">
  <button type="submit">Search</button>
</form>

<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('POST', 'https://api.perplexity.ai/chat/completions', [
  'body' => '{"model":"pplx-70b-online","messages":[{"role":"system","content":"Be precise and concise."},{"role":"user","content":"How many stars are there in our galaxy?"}]}',
  'headers' => [
    'accept' => 'application/json',
    'authorization' => 'Bearer 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',
    'content-type' => 'application/json',
  ],
]);

echo $response->getBody();