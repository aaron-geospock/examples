# Kepler.gl Map Visualization Example

This example project provides all the code and example data for a self-contained web app built around [Kepler.gl](https://kepler.gl) that visualizes the results of a [**GeoSpock DB**](https://geospock.com) query. Use as the starting point for interactive Kepler visualizations of your [**GeoSpock DB**](https://geospock.com) datasets.

## Preparing the dataset in GeoSpock DB

You need access to a deployment of **GeoSpock DB 3.0**, into which you must ingest the _Million Musical Tweets Dataset_, using the dataset ID `tweet`. Full instructions can be found in the [README from the datasets folder](../datasets/) in this repository.

The [Million Musical Tweets Dataset (MMTD)](http://www.cp.jku.at/datasets/MMTD/) provides a list of events describing when and where people have listened to specific music tracks (`tweet.zip`), extracted from the global Twitter feed between September 2011 and April 2013, and made publicly available by The Johannes Kepler University Linz. The dataset was created as part of [this research paper from 2013](http://www.cp.jku.at/people/hauger/pdf/ISMIR_2013.pdf):

> **The Million Musical Tweets Dataset - What We Can Learn From Microblogs**<br />
> Hauger, D. and Schedl, M. and Košir, A. and Tkalčič, M.<br />
> Proceedings of the 14th International Society for Music Information Retrieval Conference (ISMIR 2013), Curitiba, Brazil, November 2013.

## Prerequisites for running the example

Clone this repository so you have the whole project available locally to build and run.

Make sure you have the following information about your GeoSpock DB deployment to hand. You’ll need to provide this each time you start the application:

 * The _SQL access_ URI for your GeoSpock DB deployment
 * Your GeoSpock DB account username
 * Your GeoSpock DB account password

To use Kepler in a standalone web app you need a [MapBox account](https://www.mapbox.com/maps/) – you can sign up for a free account that works for development and evaluation. Sign in to MapBox Studio and create an [API access token](https://docs.mapbox.com/help/glossary/access-token) for this example. Copy and paste the token into  the source file `src/js/components/Kepler.js`.

## Building and running the application

You can use either [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) to install the required third party libraries:

```
$ [npm | yarn] install
```

Start the application running on a local web server by executing the `develop` script:

```
$ [npm | yarn] run develop
```

This will start [Webpack](https://webpack.js.org/) in development mode, serving the app at [http://localhost:3030](http://localhost:3030). Open the URL in a browser and you should see the login dialog, where you can fill in your deployment information and account credentials. Once the SQL query has run, the results will be visualized and you can use the Kepler UI.

## Changing the SQL Query

The example is set up with a SQL query that retrieves data from the `tweet` dataset within a simple time range. The query can be changed in the source file `src/js/components/DataLoader.js` – several alternative example queries are provided in the source code, or you can write your own. See the comments in the source code for more information.
