import 'whatwg-fetch';


function urlEncodeFormData(formData) {
  const urlEncodedDataPairs = [];
  for (const pair of formData.entries()) {
    urlEncodedDataPairs.push(`${encodeURIComponent(pair[0])}=${encodeURIComponent(pair[1])}`);
  }
  return urlEncodedDataPairs.join('&').replace(/%20/g, '+');
}


export function postFormData(url, formData) {
  const urlEncodedData = urlEncodeFormData(formData);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': urlEncodedData.length,
      'cache-control': 'no-cache',
    },
    body: urlEncodedData,
    credentials: 'same-origin',
  }).then(response => response.text());
}
