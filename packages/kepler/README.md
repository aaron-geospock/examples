# GeoSpock Integration: Kepler

Integration example using [kepler.gl](https://kepler.gl/).

## Setting up to run the example

You require the following details to be able to run this example. The can all be set in the `integrations/packages/kepler/src/js/components/App.js` file:
 * **PRESTO_URI** - the URI of the Presto REST API
 * **PRESTO_USER** - the Presto user that will run the query 
 * **MAPBOX_TOKEN** - your Mapbox API access token

You will also be prompted to enter authentication details when teh query is submitted, this user doesn't have to be the same as the `PRESTO_USER` above. 

## Running the example

You can use either [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) to install the required third party libraries:

```
$ cd integrations/packages/kepler
$ npm install
```
or
```
$ cd integrations/packages/kepler
$ yarn install
```

You can then start the example application by executing the `develop` script:

```
$ npm run develop
```

This will start Webpack running on [http://localhost:3030](http://localhost:3030). Using your browser to access this will send the example query to Presto for execution. Once the results of the query have been received Kepler will be used to visualise them. 

