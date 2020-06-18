package com.geospock.spark.presto

import java.net.URI
import java.sql.{Connection, DriverManager}
import java.util.Properties

import org.apache.hadoop.fs.{FileSystem, Path}
import org.apache.spark.sql.SparkSession

object SparkPrestoJDBCTest extends App {
  // Required configuration here
  // See README.md for instructions
  val s3bucket = "s3://<bucket name>"
  val s3Prefix = "<prefix>"
  val hiveSchemaName = "<hive schema>"
  val hiveTableName = "<hive table name>"

  val dburl = "jdbc:presto://<presto host>:<port>/"

  val username = "<presto user name>"
  val password = "<presto password>"
  // Configuration ends

  val trimmedPrefix = s3Prefix.stripPrefix("/").stripSuffix("/")

  class When[A](a: A) {
    def when(f: A => Boolean)(g: A => A) = if (f(a)) g(a) else a
  }

  implicit def whenever[A](a: A) = new When(a)

  processFiles()

  def buildPropertiesFromMap(properties: Map[String, String]) =
    (new Properties /: properties) {
      case (a, (k, v)) =>
        a.put(k, v)
        a
    }

  def clearup(connectionSQL: Connection, session: SparkSession): Unit = {
    // Delete table metadata from Presto
    System.out.println("Dropping table...")
    execPrestoSQL(connectionSQL,
      s"""drop table if exists hive.$hiveSchemaName.$hiveTableName"""
    )

    // Delete the table meta data from Spark
    session.sql(s"""drop table if exists ${hiveTableName}""")

    // Delete the temporary table data
    FileSystem.get(new URI(s3bucket), session.sparkContext.hadoopConfiguration).delete(new Path(s"""${s3bucket}/${trimmedPrefix}/${hiveTableName}"""), true)
  }

  def execPrestoSQL(connectionSQL: Connection, sqlText: String) = {
    connectionSQL.createStatement().executeUpdate(sqlText)
  }

  def processFiles(): Unit = {


    val driverString = "com.facebook.presto.jdbc.PrestoDriver";

    val connectionPropertiesMap: Map[String, String] = Map(
      "url" -> dburl,
      "driver" -> driverString,
      "SSL" -> "true",
      "user" -> username,
      "password" -> password)

    val connectionProperties = buildPropertiesFromMap(connectionPropertiesMap)
    connectionProperties.remove("url")
    connectionProperties.remove("driver")

    val connectionSQL = DriverManager.getConnection(dburl, connectionProperties)


    val session =
      SparkSession.builder().when(_ => true)(_.master("local"))
        .config("spark.dynamicAllocation.executorIdleTimeout", "180")
        .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
        .enableHiveSupport()
        .appName("Misc").getOrCreate()

    // Delete the Hive metadata and underlying S3 data:
    clearup(connectionSQL, session)

    execPrestoSQL(connectionSQL,
      s"""create schema if not exists hive.${hiveSchemaName} with (location = '${s3bucket}/${trimmedPrefix}/')"""
    )

    // Data extraction query
    // Approximately the Metropolis of Greater Paris
    // Note that any partitioning column(s) must be last
    val sqlQuery =
    """  select
      |    tweetid,
      |    id,
      |    timestamp,
      |    latitude,
      |    longitude,
      |    trackid,
      |    userid,
      |    weekday
      |  from geospock.default.tweet
      |  where longitude between 2.08 and 2.64
      |  and latitude between 48.65 and 49.05
      |  """.stripMargin


    // The partitioned_by clause can be omitted, or extra partitioning columns can be added.
    // Create table in Hive:
    System.out.println("Recreating table...")
    execPrestoSQL(connectionSQL,
      s"""create table hive.$hiveSchemaName.$hiveTableName
         |  with (
         |    format = 'TEXTFILE',
         |    partitioned_by = array['weekday']
         |  )
         |  as $sqlQuery""".stripMargin
    )

    // get table definition
    System.out.println("Getting table create definition...")
    val describeTableSqlQuery = s"""SHOW CREATE TABLE hive.$hiveSchemaName.$hiveTableName"""
    val resultSet = connectionSQL.createStatement().executeQuery(describeTableSqlQuery)
    val tableCreationDescriptionTemp = new StringBuilder("")
    while (resultSet.next()) {
      tableCreationDescriptionTemp.append(resultSet.getString(1))
    }
    System.out.println(tableCreationDescriptionTemp)

    val columnsPattern = "(?s)CREATE TABLE .*?\\((.*?)\\)(?:.*partitioned_by *= *ARRAY\\[(.*?)\\])?.*".r
    val columnsPattern(columnsList, partitioningList) = tableCreationDescriptionTemp.toString()

    val partitioningColumnNames = if (partitioningList == null)
      Array[String]()
    else
      partitioningList.split(",").map(text => text.stripPrefix("'").stripSuffix("'"))

    // These are the type names that need translating from Presto to Spark:
    val typeLookup = Map(
      "varchar" -> "string",
      "integer" -> "int"
    )
    // Other types, such as timestamp and double do not need to be translated

    val regularColumns = columnsList
      .split(",")
      .map(name => name.trim().split(" ", 2))
      .filter(nameType => !(partitioningColumnNames contains nameType(0)))
      .map(nameType => s"""${nameType(0)} ${typeLookup.getOrElse(nameType(1), nameType(1))}""")
      .mkString(",\n  ")

    val partitioningColumns = columnsList
      .split(",")
      .map(name => name.trim().split(" ", 2))
      .filter(nameType => partitioningColumnNames contains nameType(0))
      .map(nameType => s"""${nameType(0)} ${typeLookup.getOrElse(nameType(1), nameType(1))}""")
      .mkString(",\n  ")

    val partitioningClause = if (partitioningColumnNames.length > 0) s"""partitioned by (${partitioningColumns})""" else ""

    val tableCreationDescription =
      s"""
         | create external table ${hiveTableName} (
         |  ${regularColumns}
         | )
         | ${partitioningClause}
         | row format delimited
         | fields terminated by '\001'
         | lines terminated by '\n'
         | location '${s3bucket}/${trimmedPrefix}/${hiveTableName}'
                                    """.stripMargin

    System.out.println("Table creation:")
    System.out.println(tableCreationDescription)

    session.sql(tableCreationDescription)

    // Rebuild the partition structure in Spark's Hive metastore:
    if (partitioningColumns.length > 0) {
      session.sql(s"""msck repair table ${hiveTableName}""")
    }

    // Do some processing with the extracted data
    session.sql(s"""SELECT * FROM ${hiveTableName}""").show()

    // Delete the Hive metadata and underlying S3 data:
    clearup(connectionSQL, session)

    connectionSQL.close()
  }

}
