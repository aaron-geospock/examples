# GeoSpock DB Discovery


GeoSpock DB Discovery provides a way to experience the power of GeoSpock DB without having to pay any license fees. You can sign up [here](https://geospock.com/en/product/geospock-db-discovery/).

Typically available for a short trial period, GeoSpock DB Discovery gives you control of your own query engine and allows you to run queries using standard ANSI SQL against a range of pre-selected datasets.

The [Singapore Python Jupyter Notebook](sg_python/) and the [Singapore Tableau Workbook](sg_tableau/) directories contain several example queries that can be used to extract insights from the Singapore-based datasets. It is recommended to execute the following code using a cluster of no less than 10 nodes.

In particular the [Python](sg_python/) directory contains the following files:

 - HTTP_connection.ipynb - HTTP connectivity example
 - HTTPS_connection.ipynb - HTTPS connectivity example
 - SmartSingapore.ipynb - Queries and insights

Additionally, the [Tableau](sg_tableau/) directory contains the following files:

- planning-area-census2010/ - Directory that contains the Singapore planing area census .shp files for further geospatial vizualisation in Tableau
- Discovery_live.twbx - Queries in this workbook are to be run live and require the respective authentication
- Discovery_local.twbx - Queries in this workbook have already been run and the data has been attached to this packaged workbook
- new_Vis.gl_Kepler.gl.trex - Kepler plugin for Tableau

Please note that the ERP data is synthetic and the storyline described around it is purely fictional.

Finally, further documentation on Discovery can be found [here](https://docs.geospock.com/discovery/about/).
