# Hot Potato

![Image of a hot potato](https://github.com/davedx/hot-potato/raw/master/public/potato.png)

Hot potato is an intercepting proxy that sits between an API and an API client, smoothly swapping certain specified responses for whatever mock or fake data you need in your client. (It matches URLs).

For ease of use, it also features a simple web interface running on the same port as the proxy itself, accessible at ```HOST_NAME/hotpotato/public/index.html```. This interface is used to add, update and delete the "spuds": hot chunks of JSON data (or XML, if that's your kink) mapped to URLs.

## Installing

Clone the repo

npm install

node index

Navigate to the web interface and start adding spuds.
