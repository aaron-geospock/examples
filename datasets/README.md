# Example Project Datasets

The following datasets are used in the **GeoSpock DB** example projects:

* Million Musical Tweets Dataset
* Synthesized Taxi Tracking in New York City
* Synthesized Traffic Tracking in Singapore

## Prerequisites

To ingest the datasets into your **GeoSpock DB** deployment, you’ll need to have an active account set up on the deployment with the administrator role. You’ll need the [GeoSpock CLI](https://pypi.org/project/geospock-cli/) installed, and initialized with your account credentials (using the `init` and
`get-credentials` commands). For help setting up the GeoSpock CLI, please refer to the
[GeoSpock DB documentation](https://docs.geospock.com/).

The source data files for the datasets are provided by GeoSpock in a public [“requester pays” AWS S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/dev/RequesterPaysBuckets.html) named `geospock-example-data`. In order to ingest them into your deployment so they can be queried in the examples, you’ll need to create your own S3 bucket in your AWS account and copy the files into it so that the GeoSpock DB ingestor can access them. Make sure you have the AWS CLI installed, so that you can run the necessary copy commands shown below.

For each dataset, you’ll need to provide the GeoSpock Ingestor with a “data source description” file describing the data format. The necessary files are supplied in this repository folder. Clone the repository, or download the JSON files from the GitHub browser, so that you have them locally ready for the ingest commands.

Once each dataset has been ingested, you’ll need to grant access permissions to it for the GeoSpock accounts you intend to use to run the examples. If you don’t have one already, create a permission group and add the desired accounts to it:

    $ geospock group-create --group-name examples
    $ geospock group-add-user --group-name examples --username [username]

## Million Musical Tweets Dataset

The [Million Musical Tweets Dataset (MMTD)](http://www.cp.jku.at/datasets/MMTD/) provides a list of events describing when and where people have listened to specific music tracks (`tweet.zip`), extracted from the global Twitter feed between September 2011 and April 2013, and made publicly available by The Johannes Kepler University Linz. The dataset was created as part of [this research paper from 2013](http://www.cp.jku.at/people/hauger/pdf/ISMIR_2013.pdf):

> **The Million Musical Tweets Dataset - What We Can Learn From Microblogs**<br />
> Hauger, D. and Schedl, M. and Košir, A. and Tkalčič, M.<br />
> Proceedings of the 14th International Society for Music Information Retrieval Conference (ISMIR 2013), Curitiba, Brazil, November 2013.

Copy the source data file, `tweet.txt`, from the `geospock-example-data` AWS S3 bucket to the bucket in your own AWS account that you created for the GeoSpock Ingestor to read from (replace `your-source-data-bucket` with the name of your bucket):

    $ aws s3 sync s3://geospock-example-data/million-musical-tweets \
                  s3://your-source-data-bucket/million-musical-tweets \
                  --request-payer

Here’s the GeoSpock CLI command to ingest the dataset into your deployment. Note that the examples that use this dataset expect it to be called `tweet`. Replace `your-source-data-bucket` with the name of the bucket you copied the data file into above. The description file `tweet-data-source-description.json`, which is supplied in this repository folder, needs to be present in the directory where you run the command:

    $ geospock dataset-create
        --dataset-id tweet \
        --data-url s3://your-source-data-bucket/million-musical-tweets/tweet.txt \
        --data-source-description-file tweet-data-source-description.json \
        --instance-count 3

The ingestion process may take some time. You can check on the current status using the `dataset-status` command:

    $ geospock dataset-status --dataset-id tweet

After the `tweet` dataset is ingested, you’ll need to grant access permissions to it for the GeoSpock accounts you intend to use to run the examples. Using the permissions group you set up in the prerequisites:

    $ geospock dataset-permission-grant --group-name examples --dataset-id tweet

## Synthesized Taxi Tracking in New York City

The New York City Taxi and Limousine Commission (TLC) collects and [publishes taxi trip record data for New York](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page), including pick up and drop off times and locations, going back to 2009. GeoSpock has taken a portion of this data and used a routing algorithm to generate synthesized vehicle tracking data between the recorded pick up and drop off points.

Copy the source data CSV files in the `synthesised-taxi-data-nyc` folder from the `geospock-example-data` AWS S3 bucket to the bucket in your own AWS account that you created for the GeoSpock Ingestor to read from (replace `your-source-data-bucket` with the name of your bucket):

    $ aws s3 sync s3://geospock-example-data/synthesised-taxi-data-nyc \
                  s3://your-source-data-bucket/synthesised-taxi-data-nyc \
                  --request-payer

Here’s the GeoSpock CLI command to ingest the dataset into your deployment. Note that the examples that use this dataset expect it to be called `synthesisedtaxidatanyc`. Replace `your-source-data-bucket` with the name of the bucket you copied the data file into above. The description file `synthesised-taxi-data-nyc-data-source-description.json`, which is supplied in this repository folder, needs to be present in the directory where you run the command:

    $ geospock dataset-create \
        --dataset-id synthesisedtaxidatanyc \
        --data-url s3://your-source-data-bucket/synthesised-taxi-data-nyc/ \
        --data-source-description-file synthesised-taxi-data-nyc-data-source-description.json \
        --instance-count 10

The ingestion process may take some time. You can check on the current status using the `dataset-status` command:

    $ geospock dataset-status --dataset-id synthesisedtaxidatanyc

After the `synthesisedtaxidatanyc` dataset is ingested, you’ll need to grant access permissions to it for the GeoSpock accounts you intend to use to run the examples. Using the permissions group you set up in the prerequisites:

    $ geospock dataset-permission-grant --group-name examples --dataset-id synthesisedtaxidatanyc

## Synthesised Traffic Tracking in Singapore

The Singapore Land Transport Authority [publishes vehicle observation records recorded by monitoring gantries](https://data.gov.sg/dataset/lta-gantry) on roads across the city. GeoSpock has taken a portion of this data and used a routing algorithm to generate synthesized vehicle tracking data between the vehicle locations recorded by the gantries.

Copy the source data CSV files in the `synthesised-traffic-data-singapore` folder from the `geospock-example-data` AWS S3 bucket to the bucket in your own AWS account that you created for the GeoSpock Ingestor to read from (replace `your-source-data-bucket` with the name of your bucket):

    $ aws s3 sync s3://geospock-example-data/synthesised-traffic-data-singapore \
                  s3://your-source-data-bucket/synthesised-traffic-data-singapore \
                  --request-payer

Here’s the GeoSpock CLI command to ingest the dataset into your deployment. Note that the examples that use this dataset expect it to be called `synthesisedtrafficdatasingapore`. Replace `your-source-data-bucket` with the name of the bucket you copied the data file into above. The description file `synthesised-traffic-data-singapore-data-source-description.json`, which is supplied in this repository folder, needs to be present in the directory where you run the command:

    $ geospock dataset-create \
        --dataset-id synthesisedtrafficdatasingapore \
        --data-url s3://your-source-data-bucket/synthesised-traffic-data-singapore/ \
        --data-source-description-file synthesised-traffic-data-singapore-data-source-description.json \
        --instance-count 10

The ingestion process may take some time. You can check on the current status using the `dataset-status` command:

    $ geospock dataset-status --dataset-id synthesisedtrafficdatasingapore

After the `synthesisedtrafficdatasingapore` dataset is ingested, you’ll need to grant access permissions to it for the GeoSpock accounts you intend to use to run the examples. Using the permissions group you set up in the prerequisites:

    $ geospock dataset-permission-grant --group-name examples --dataset-id synthesisedtrafficdatasingapore
