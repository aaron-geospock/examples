# Apache Spark™ in Zeppelin Notebooks Example

This example project provides a tutorial demonstrating how to integrate GeoSpock DB queries into an [Apache Spark™](https://spark.apache.org) analysis, inside a [Zeppelin notebook](https://zeppelin.apache.org). Example code is provided in both Python and Scala, and includes visualization with the [Zeppelin Leaflet plugin](https://github.com/myuwono/zeppelin-leaflet).

## Preparing the dataset in GeoSpock DB

You need access to a deployment of **GeoSpock DB 3.0**, into which you must ingest the _Million Musical Tweets Dataset_, using the dataset ID `tweet`. Full instructions can be found in the [README from the datasets folder](../datasets/) in this repository.

The [Million Musical Tweets Dataset (MMTD)](http://www.cp.jku.at/datasets/MMTD/) provides a list of events describing when and where people have listened to specific music tracks (`tweet.zip`), extracted from the global Twitter feed between September 2011 and April 2013, and made publicly available by The Johannes Kepler University Linz. The dataset was created as part of [this research paper from 2013](http://www.cp.jku.at/people/hauger/pdf/ISMIR_2013.pdf):

> **The Million Musical Tweets Dataset - What We Can Learn From Microblogs**<br />
> Hauger, D. and Schedl, M. and Košir, A. and Tkalčič, M.<br />
> Proceedings of the 14th International Society for Music Information Retrieval Conference (ISMIR 2013), Curitiba, Brazil, November 2013.

## Prerequisites for running the example

Clone this repository so you have the Zeppelin notebook files from this folder available locally to open.

Open the [Apache Zeppelin](https://zeppelin.apache.org/) website, and follow the instructions on the Quick Start page to install and start Zeppelin.

## Zeppelin configuration

- In the Zeppelin directory where you have installed the Zeppelin service, create a file named `config.json` with the following structure:

```json
{
    "url": "jdbc:presto://sqlaccess-example.geospock.com:8446",
    "user": "example-username",
    "password": "example-password"
}
```

- Give the Zeppelin Spark interpreter the required JDBC driver to connect to GeoSpock DB. To do this, in the "Interpreter" page of your Zeppelin instance (http://localhost:8080/#/interpreter), search for "Spark", then edit that interpreter configuration to include `io.prestosql:presto-jdbc:332` as an artifact in the "Dependencies" field.
- Enable the download of Helium visualization packages. In the Zeppelin directory edit the file `conf/zeppelin-site.xml`, and change the `zeppelin.helium.registry` property to have the value `helium,https://s3.amazonaws.com/helium-package/helium.json`, like this:

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<configuration>

<property>
  <name>zeppelin.helium.registry</name>
  <value>helium,https://s3.amazonaws.com/helium-package/helium.json</value>
</property>

</configuration>
```

- Restart Zeppelin.
- Enable the "Leaflet" map visualization plugin. To do this, in the Helium page (http://localhost:8080/#/helium), refresh, then enable the `zeppelin-leaflet` visualization library.
- Restart Zeppelin again.

Once all of these steps have been completed, you can import the .zpln files included in this directory into Zeppelin via the _Notebook_ > _Import Note_ menu.
