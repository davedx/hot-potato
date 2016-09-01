# Hot Potato

![Image of a hot potato](https://github.com/davedx/hot-potato/raw/master/public/potato.png)

Hot potato is an intercepting proxy that sits between an API and an API client, smoothly swapping certain specified responses for whatever mock or fake data you need in your client. (It matches URLs).

For ease of use, it also features a simple web interface running on the same port as the proxy itself, accessible at `HOST_NAME/hotpotato/public/index.html`. This interface is used to add, update and delete the "spuds": hot chunks of JSON data (or XML, if that's your kink) mapped to URLs.

## What's it useful for?

* You need to develop client code that's dependent on backend responses, but the backend isn't ready yet: use it to avoid having to pollute your client by hardcoding or loading mock data.

* You have test scenarios that are very difficult to replicate in your production or staging environments: simulate the exact data you need in the client.

* You don't want to mess about with native desktop clients, or you need to do intercepting on a server inside a secure network...

## Installing

Clone the repository

    npm install

    node index <HOST> <LOCAL_PORT>

Navigate to the web interface and start adding spuds.

## Usage

To add a spud, enter a URL to intercept in the URL field (can include query parameters). Then in the spud textarea, put the response you want to be returned. Press 'Send'. Do the same to update an existing spud.

You can also add spuds manually by putting them in the `spuds` directory, ensuring the nested directories match the URL structure (there is no database).

Finally, you'll need to update your API client (web app, game, orchestration layer, etc.) to point at the proxy instead of the API.
