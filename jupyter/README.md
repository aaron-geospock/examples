# Python in Jupyter Notebooks Example

This example project provides a tutorial demonstrating how to query and analyze a [**GeoSpock DB**](https://geospock.com) dataset with Python code in [a Jupyter notebook](https://jupyter.org), including map visualization with the [Kepler.gl Jupyter widget](https://github.com/keplergl/kepler.gl/tree/master/bindings/kepler.gl-jupyter).

## Preparing the dataset in GeoSpock DB

You need access to a deployment of **GeoSpock DB 3.0**, into which you must ingest the _Million Musical Tweets Dataset_, using the dataset ID `tweet`. Full instructions can be found in the [README from the datasets folder](../datasets/) in this repository.

The [Million Musical Tweets Dataset (MMTD)](http://www.cp.jku.at/datasets/MMTD/) provides a list of events describing when and where people have listened to specific music tracks (`tweet.zip`), extracted from the global Twitter feed between September 2011 and April 2013, and made publicly available by The Johannes Kepler University Linz. The dataset was created as part of [this research paper from 2013](http://www.cp.jku.at/people/hauger/pdf/ISMIR_2013.pdf):

> **The Million Musical Tweets Dataset - What We Can Learn From Microblogs**<br />
> Hauger, D. and Schedl, M. and Košir, A. and Tkalčič, M.<br />
> Proceedings of the 14th International Society for Music Information Retrieval Conference (ISMIR 2013), Curitiba, Brazil, November 2013.

## Prerequisites for running the example

Clone this repository so you have the Jupyter notebook files from this folder available locally to open.

Make sure you have the following information about your GeoSpock DB deployment to hand. You’ll need to insert the information in the relevant places in the Jupyter notebooks to get the queries to work (full instructions are provided in the notebooks):

 * The _SQL access_ URI for your GeoSpock DB deployment
 * Your GeoSpock DB account username
 * Your GeoSpock DB account password

## Installing and running Jupyter

Open a terminal and set the current directory to your local clone of this repository folder.

You can either install Jupyter globally by running the `pip` command below directly, or you can first create a [Python virtual environment](https://docs.python.org/3/tutorial/venv.html) if you’d prefer to install locally. Detailed instructions are available [from the Jupyter website](https://jupyter.org/install.html). To install Jupyter and all the components that are used in the example notebooks, run the following command. Please note that Python 3 is required – on some systems you need to use the `pip3` command instead.

```
$ python -m pip install -r requirements.txt
```

Once installed, the following command will start The Jupyter Notebook server, and optionally open the  file browser in a new browser tab for you:

 ```
 $ jupyter notebook [--no-browser]
 ```

You will then be able to choose from the following notebooks:

 - `Case Study.ipynb` is an example analysis of geographical music listening that runs various **GeoSpock DB** SQL queries on the tweets dataset, and uses Jupyter to display:
    - Interactive maps with overlaid results, making use of the [Kepler.gl Jupyter widget](https://github.com/keplergl/kepler.gl/tree/master/bindings/kepler.gl-jupyter)
    - Charts, making use of [Matplotlib](https://matplotlib.org/)
 - `Connections.ipynb` contains the code needed to run **GeoSpock DB** queries in Python using three different popular Presto client libraries

### Python virtual environments

If you installed the required packages to a virtual environment, you'll need to create a new Jupyter kernel for running the notebooks, as the default kernel won't know about your locally installed packages. Run the following from your virtual environment (the value you specify in the square brackets is the name of the new kernel as it will appear in the Jupyter menu):

```
(myvenv) $ python -m ipykernel install --user --name=[myvenv]
```

Once installed, run `jupyter notebook [--no-browser]`, and select a notebook from the list. Once the notebook is open, select your new kernel from the Jupyter menu at `Kernel > Change Kernel > [myenv]`. You will need to select this kernel for each notebook in turn.
