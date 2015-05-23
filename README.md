[SF Bus Departure Times](http://puncsky.cloudapp.net/) gives real-time departure time for San Francisco public transportation.
You can find stops nearby or query a specific route. See the routes and stops on the map and click to
show real-time departure information.

![SF Bus Departure Times screen shot](http://puncsky.cloudapp.net/screen-shot.png)


Live on Azure @ [SF Bus Departure Times](http://puncsky.cloudapp.net/)

## Features and Specs

- Show real-time departure times for all routes at a bus stop. (Click Stop on Map to Show Departure Times) Active info
panel is updated every 5 seconds.
- Geolocate yourself. (Where am I?)
- Find points of interests. (Show Stops near Center)
- Toggle route to show/hide on map, routes filter and **typeahead** search for routes.

## Tech Stack

I hear from the first interview that the real time team is heavily using Node.js so I choose the Javascript tech stack:

- **Backbone.js** (first time usage), for it is recommended and lightweight.
- **Node.js** (with **Express** middleware), for it is the Server-side Javascript by-default choice.
- **MongoDB** (with **Mongoose** ODM), for its support for geospatial indexes and queries, though you can definitely 
hold all data in memory for this small amount of data.
- **Mocha** and **Chai**, for integration test.
- Others: Bootstrap css, list.js, Google map api, jQuery (of course), underscore lib, async lib, config, 
httpsync, serve-static, superagent, etc.

### MVC

Backend follows a typical MVC structure. Models and controllers are registered at
`server.js`. Views (front-end static resources) are served in a static way in `webapp/`.
All configs are placed in `config/`.

Frontend follows the same practice. `webapp/models` and `webapp/collections` talk to the server and `webapp/views`
handle the dynamic rendering and user interaction. `webapp/googlemap.js` manages the map and operations on it in
the global scope. 

### Behavior-Driven Development

The backend is fairly-well tested with integration tests. Due to time constraints, unit tests are omitted and
the frontend code is not tested.

### Hybrid Web API

Assuming we will not reach the rate limit of NextBus public API and Auths are not needed, I take a hybrid API strategy.
It is a read-only service, and `utils/initDbFromRemoteDataSource.js` will load data from NextBus API. In addition to
NextBus API, I provide some more for read optimization of my app:

- `GET /` single page web app
- `GET /api/busstops` get all unique bus stops
- `GET /api/busstops?lat={lat}&lon={lon}&miles={miles}` query bus stops near a geo-location within a radius in miles.
- `GET /api/busstops/:stopId` get a specific stop with a stopId
- `GET /api/routes` get all routes info

## Setup, Run, and Test

    https://github.com/puncsky/SFBusDepartureTimes.Uber.git
    cd SFBusDepartureTimes.Uber

    npm install # install backend npm packages
    cd webapp
    npm install # install frontend npm packages
    cd ..

**Configure your backend at `config/default.json` and frontend at `webapp/js/config.js`.** And then run the server:
 
    node server.js

When the server is fully loaded (need to load MongoDB from NextBus API for few seconds), run tests

    npm test

## Links

- [Github Repo](https://github.com/puncsky/SFBusDepartureTimes.Uber)
- [View the Demo Hosted @ Azure](http://puncsky.cloudapp.net/)
- [Linkedin](https://www.linkedin.com/pub/tian-pan/31/8/753)
- [Resume](http://puncsky.cloudapp.net/resume.pdf)
- [Download Source Code](https://github.com/puncsky/SFBusDepartureTimes.Uber/archive/master.zip)