# Freightflo Project

## Overview
Follow the instructions below to set up the project environment and run it on your local machine for development and testing.

## Prerequisites
Before you begin, ensure you have the following installed:
- Python 3.9
- pip
- MySQL
- MySQL Workbench

## Installation

### Clone the Repository
To get started, clone this repository to your local machine:
```bash
git clone https://github.com/gauthamnairvm/freightflo_repo.git
cd freightflo_repo

```
### Setup Virtual Environment (Optional)
It's recommended to use a virtual environment for Python projects to keep dependencies separate and organized. Here's how you can set up a virtual environment:
```bash
#On windows cmd prompt.
python -m venv env
cd env
cd Scripts
activate.bat
```
Note: This step is optional but recommended. Make sure your virtual environment is active when running the project files. You can navigate back to /freighflo_repo, after you run activate.bat

```
### Install Dependencies
Install all required dependencies by running:
```bash
pip install -r requirements.txt

```
## Configure MySQL Database
### Install MySQL
If MySQL is not installed on your system, download and install it from the MySQL official website (https://dev.mysql.com/downloads/mysql/). Follow the installation guide suitable for your operating system.

### Download and Install MySQL Workbench

1. **Navigate to MySQL Downloads:** Visit the [MySQL Downloads Page](https://dev.mysql.com/downloads/workbench/).
2. **Select the Version:** Choose the appropriate version of MySQL Workbench for your operating system (Windows, macOS, or Linux).
3. **Download the Installer:** Click on the download link and follow the on-screen instructions. You might need to log in or sign up for an Oracle account, or you can choose to skip this by clicking "No thanks, just start my download."
4. **Install MySQL Workbench:** Once downloaded, open the installer and follow the instructions to install MySQL Workbench on your computer.

### Create a Connection in MySQL Workbench

1. **Open MySQL Workbench:** Launch MySQL Workbench from your applications or programs list.
2. **Create a New Connection:** Click on the "+" icon next to "MySQL Connections" to set up a new connection.
3. **Configure the Connection:**
   - **Connection Name:** Give your connection a name (e.g., "Local MySQL").
   - **Hostname:** Enter `localhost` if your MySQL server is running on the same machine.
   - **Port:** The default MySQL port is `3306`.
   - **Username:** Enter the username (e.g., `root` or your MySQL username).
   - **Password:** Click the "Store in Vault" button to save your password (optional but recommended for convenience).
   - **Advanced Settings:** go to advanced options and type "OPT_LOCAL_INFILE=1" when creating the connection.
4. **Test Connection:** Click "Test Connection" to ensure that all settings are correct and MySQL Workbench can connect to the MySQL server.
5. **Confirm and Save:** If the test is successful, click "OK" to save the connection.

**NOTE:It is important to follow proper setup of MySQL workbench for proper working of this project. Please follow the instructions thoroughly including the Advanced Settings**


### Configure environment variables
Update the `.env` file in your project directory with your database settings.
```python 
DATABASE_NAME="faf5"
DATABASE_USER="root" #Replace with your actual username/ or use default root user
DATABASE_PASSWORD="mypassword" #Replace with your actual password created during the setup
DATABASE_HOST="localhost"
DATABASE_PORT=3306  # Use the default MySQL port unless you have changed it.

```
### Run SQL Scripts
After creating you set up MySQL workbench, you need to run the SQL scripts provided in the project to set up the tables and any initial data. These scripts are located in the `data/sql` folder within the project directory.

Once in workbench, you can open the scripts to a Query editor tab and run each SQL script file in the the following order.
```bash
data_cleaning.sql;
map_nodes.sql;
map_edges.sql;
map_node_weights.sql;

```
Here is a list of files that are necessary to ensure proper working of the project:

records.csv - This file can be downloaded from the official faf5 website [Freight Analysis Framework Version 5](https://faf.ornl.gov/faf5/Default.aspx). You can alternatively use the file `data/sample_records.csv` for a quick setup and later replace it with the downloaded file.

Meta data files can be accesed at `data/` (Required):
commodity.csv
distance_bands.csv
domestic_zones.csv
foreign_zones.csv
trade_type.csv
transportation_mode.csv
zone_state_assoc.csv
state_region_assoc.csv
states.csv
regions.csv

To set up the clique_edges table which you can run the provided python script `data/clique_processing.py` and it will create the table for you. Please make sure you run all the sql scripts first and ensure that interdf_records table is present in your database before running the script. Alternatively you can choose to import the `data/clique_edges.csv` file into a table called clique_edges in your database.

**NOTE: Please ensure that the scripts are run in the particular order mentioned above. Replace the paths to files in the queries with the correct and complete path location to your datafiles.**

**FOR EXAMPLE:** In the `data/sql/data_cleaning.sql` script
```sql
-- REPLACE {path_to_your_files} with your actual path.
LOAD DATA LOCAL
    INFILE '{path_to_your_files}\records.csv'
    INTO TABLE records_temp
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;
```
Add the complete path, and correct file name for records.csv, depending on which file you decide to use sample_data/ downloaded data from the wesite.

For other metadata file loads, you can use the complete path to the location to which freightflo_repo was cloned to, and navigate to `data` folder to fetch the files.

```sql
LOAD DATA LOCAL
-- REPLACE {path_to_freightflo_repo} with your actual path
    INFILE '{path_to_freightflo_repo}\data\commodity.csv'
    INTO TABLE commodity
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES;
```

### Configure Django to Use MySQL
### Generate a Secret Key
To generate a new secret key for your project, run the following command in your Python environment:
```python
from django.core.management.utils import get_random_secret_key
print("SECRET_KEY='" + get_random_secret_key() + "'")

```
Copy the output and paste it into your .env file for the SECRET_KEY variable.
```python
SECRET_KEY = "your_generated_key"

```
## Run the Project
### Apply Migrations
Before running the server, you need to apply migrations to your database. This ensures that any Django model changes are properly reflected in the database schema.Navigate to the freightflo folder with the `manage.py` script and run the following commands:

```bash
python manage.py makemigrations
python manage.py migrate

```
You can visit [Django Tutorial](https://www.w3schools.com/django/) for detailed steps regarding setting up Django, and creating a Django Project from scratch. 
Note: For this project installing the dependencies in requirements.txt and following the steps mentioned above is sufficient.


### Start the Development Server
Start the Django development server:
```bash
python manage.py runserver
```
Visit `http://127.0.0.1:8000` in your web browser to see the project running.

### Code files summary
`freightflo/fflo/templates/main_page.html` - Conatins the HTML template of the FREIGHFLO INTERFACE.
`freightflo/fflo/static/scripts/` - Contains all the javascript scripts required to build the website.
`freightflo/fflo/static/scripts/`

### Contributors
Trent Demers - ttd31@scarletmail.rutgers.edu
Anish Budhi - akb147@scarletmail.rutgers.edu
Gautham Nair - vn240@scarletmail.rutgers.edu
