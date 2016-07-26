import 'whatwg-fetch';


function urlEncodeFormData(formData) {
  let urlEncodedData = "";
  let urlEncodedDataPairs = [];
  for(let pair of formData.entries()) {
     urlEncodedDataPairs.push(encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]));
  }
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
  return urlEncodedData;
}


export function postFormData(url, formData) {
  let urlEncodedData = urlEncodeFormData(formData);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': urlEncodedData.length,
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
    },
    body: urlEncodedData,
    credentials: 'same-origin'
  }).then(function(response) {
    return response.text();
  })
}
