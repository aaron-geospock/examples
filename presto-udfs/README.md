# User-Defined Functions (UDFs)
Presto allows the addition of user defined functions via plugins. These functions can be written in java and then 
provided to Presto as a .jar file when deploying a cluster.

## Example UDFs
This repository contains the following sample UDFs for Presto:

 - `is_pasta(<string>)` is a scalar function that returns true if the string provided is equal to `pasta` 
 (ignoring case), otherwise returns false.
 - `avg_between_limits(<value double>, <lower limit double>, <upper limit double>)` is an aggregate function that 
 returns an average of those numbers that are between the lower and upper limits. If no values between those limits are
 found, returns null.

## Adding UDFs
Refer to https://prestodb.io/docs/current/develop/functions.html for details on how to add your own functions.

The name of the function when used in a SQL query in Presto is specified in the `@ScalarFunction("<name here>")`
annotation for scalar functions and `@AggregationFunction("<name here>")` annotation for aggregate functions.

When all your UDF functions have been defined, the `GeospockUdfPlugin` class (or similar) that implements the `Plugin` 
interface should be edited to contain references to each function class.

A jar file can then be produced (using e.g the `mvn package` command) and the resulting file then copied to an 
accessible s3 bucket location ready to be deployed.

## Using multiple UDF packages
Multiple packaged jar files can be added to a Presto cluster, in case there is a requirement to "mix and match" which
UDFs are available. However, the class that implements `Plugin` (in this example repository, the `GeoSpockUdfPlugin` 
class) must be unique in each repository. The `com.facebook.presto.spi.Plugin` file in the resources/META-INF.services 
directory must contain the full path (including package) of this class.

## Plugging in Presto UDFs
When deploying a presto cluster using terraform, the variable `presto_udf_jar_locations` can be supplied with a list of
s3 locations with any compiled jar files with UDF functions, e.g.
```
# List of s3 locations for any jar files containing UDFs to import
# default: []
presto_udf_jar_locations = ["s3://example-bucket/example-folder/geospock-udfs-1.0.0.jar"]
```

