# [GeoSpock DB 3.0](https://geospock.com) Example Projects

[**GeoSpock DB**](https://geospock.com) is the extreme-scale, cloud-deployed database specializing in high-performance SQL querying of geospatial event data. The example projects in this repository show how to integrate [**GeoSpock DB version 3.0**](https://geospock.com) with a range of popular tools as a starting point for common use cases:

### For Data Analysts

 * [**Tableau (with Kepler.gl visualizations)**](tableau-kepler/README.md) – A tutorial showing how to run GeoSpock DB queries on a (provided) example dataset using [Tableau](https://www.tableau.com), and visualize the results inside Tableau using the [Kepler.gl extension](https://github.com/keplergl/kepler.gl-tableau).

### For Data Scientists

 * [**Python in Jupyter notebooks**](jupyter/) – A tutorial demonstrating how to query and analyze a GeoSpock DB dataset with Python code in [a Jupyter notebook](https://jupyter.org), including map visualization with the [Kepler.gl Jupyter widget](https://github.com/keplergl/kepler.gl/tree/master/bindings/kepler.gl-jupyter).
 * [**Apache Spark™ in Zeppelin notebooks**](spark/) – A tutorial demonstrating how to integrate GeoSpock DB queries into an [Apache Spark™](https://spark.apache.org) analysis, inside a [Zeppelin notebook](https://zeppelin.apache.org). Example code is provided in both Python and Scala, and includes visualization with the [Zeppelin Leaflet plugin](https://github.com/myuwono/zeppelin-leaflet).
 * [**Apache Spark™ integration via Apache Hive™**](presto-hive-spark/) - A tutorial demonstrating how to export GeoSpock DB queries to an [Apache Hive™](https://hive.apache.org/) table, enabling high performance parallel querying of data in [Apache Spark™](https://spark.apache.org). 

### For Visualization Developers

 * [**Kepler.gl map visualization**](kepler/) – All the code and example data for a self-contained web app built around [Kepler.gl](https://kepler.gl) that visualizes the results of a GeoSpock DB query. Use as the starting point for interactive Kepler visualizations of your GeoSpock DB datasets.
 * [**CesiumJS 3D world simulation**](cesium/) – All the code and data for a self-contained web app that uses [CesiumJS](https://cesium.com/cesiumjs/) to create a 3D city simulation in the browser, populated with animated vehicles playing back tracking data queried from GeoSpock DB. Use as the starting point for your own GeoSpock-powered 3D world simulations.
 * [**GeoSpock DB queries from JavaScript**](presto-client-browser/) – an NPM module, [`presto-client-browser`](https://www.npmjs.com/package/presto-client-browser), which you can use to run GeoSpock DB queries in your own JavaScript browser apps. For example usage, refer to the Kepler and Cesium examples above, which both use the module to query their datasets.

## Datasets

The source data for the example datasets and other large resources needed to run these projects is provided by GeoSpock in an AWS S3 bucket named `geospock-example-data`. Full instruction on how to download the files and ingest the data into your GeoSpock DB deployment, along with the necessary data source description files, can be found in the [datasets folder](datasets/).
