# Intoduction

This example shows how to load data from a Presto query into a temporary Hive table which can be queried from Spark.

# Prerequisites

The Presto cluster needs to be configured with a Hive catalog.

Access to S3 and a Spark EMR cluster is assumed - creation of these is out of the scope of this document.

This example uses the tweets dataset - to obtain this see instructions at the top level of the repository.

# Preparation

Edit the file SparkPrestoJDBCTest.scala to configure the following variables:

```
    val s3bucket = "s3://<bucket name>"
    val s3Prefix = "<prefix>"
    val hiveSchemaName = "<hive schema>"
    val hiveTableName = "<hive table name>"

    val dburl = "jdbc:presto://<presto host>:<port>/"

    val username = "<presto user name>"
    val password= "<presto password>"
```

Edit the example query if required after the comment:
```
    // Data extraction query
```

Insert any desired processing step after the comment:
```
    // Do some processing with the extracted data
```

**NB** - all data will be deleted from the configured S3 location both before and after the processing step.
Delete appropriate sections of the code if this is not desired.

# Overview

- A Presto Hive schema backed by S3 is created (if it does not already exist)
- Data in S3 is cleared and metadata removed from Presto and Spark
- The Presto hive table is populated with the results of an SQL query
- An external table is created in Spark backed by the same data
- Example processing in Spark is run on the table
- Data in S3 is cleared and metadata removed from Presto and Spark

# Run

Adapt the following commands as needed.

- Build the package:

```
mvn package
```

- copy it to the EMR master:

```
scp target/spark-analysis-0.0.1-shaded.jar ec2-user@emr-master-address:/tmp
```

- and run it:

```
ssh ec2-user@emr-master sudo -u hadoop spark-submit --class com.geospock.spark.presto.SparkPrestoJDBCTest --deploy-mode client --master yarn /tmp/spark-analysis-0.0.1-shaded.jar
```
