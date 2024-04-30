# Freightflo Project

## Overview
Follow the instructions below to set up the project environment and run it on your local machine for development and testing.

## Prerequisites
Before you begin, ensure you have the following installed:
- Python 3.9
- pip
- MySQL (or any other database you prefer, but the instructions below are provided for setting up MySQL.)

## Installation

### Clone the Repository
To get started, clone this repository to your local machine:
```bash
git clone https://github.com/gauthamnairvm/freightflo_repo.git
cd freightflo

### Setup Virtual Environment (Optional)
It's recommended to use a virtual environment for Python projects to keep dependencies separate and organized. Here's how you can set up a virtual environment:
python -m venv env
source env/bin/activate  # On Windows use `env\Scripts\activate`
Note: This step is optional but recommended.

### Install Dependencies
Install all required dependencies by running:
pip install -r requirements.txt

## Configure MySQL Database
### Install MySQL
If MySQL is not installed on your system, download and install it from the MySQL official website (https://dev.mysql.com/downloads/mysql/). Follow the installation guide suitable for your operating system.

### Set Up MySQL Database
Open MySQL Command Line Client. You will need to enter the root password that was set during the installation of MySQL.
Create a new database:
CREATE DATABASE faf5;

### Run SQL Scripts
After creating your database, you need to run the SQL scripts provided in the project to set up the tables and any initial data. These scripts are located in the `data/sql` folder within the project directory.

Navigate to the directory where you cloned the repository, and then to the `data/sql` folder.
Log into MySQL from the command line using your MySQL username (replace `yourusername` with your actual MySQL username or you can use the default root user that was setup during the installation):
mysql -u yourusername -p faf5
Once logged in, run each SQL script file by using the SOURCE command in the following order.
SOURCE data_cleaning.sql;
SOURCE map_nodes.sql;
SOURCE map_edges.sql;
SOURCE map_node_weights.sql;

NOTE: Please ensure that the scripts are run in the particular order mentioned above. Replace the paths to files in the queries with the correct and complete path location to your datafiles.

Here is a list of files that are necessary to ensure proper working of the project:


### Configure Django to Use MySQL
Update the `.env` file in your project directory with your database settings. 
DATABASE_NAME=faf5
DATABASE_USER=root #Replace with your actual username/ or use default root user
DATABASE_PASSWORD=mypassword #Replace with your actual password created during the setup
DATABASE_HOST=localhost
DATABASE_PORT=3306  # Use the default MySQL port unless you have changed it.

### Generate a Secret Key
To generate a new secret key for your project, run the following command in your Python environment:
```python
from django.core.management.utils import get_random_secret_key
print("SECRET_KEY='" + get_random_secret_key() + "'")

Copy the output and paste it into your .env file for the SECRET_KEY variable.
SECRET_KEY = your_generated_key

## Run the Project
### Apply Migrations
Before running the server, you need to apply migrations to your database. This ensures that any Django model changes are properly reflected in the database schema.Navigate to the freightflo folder with the `manage.py` script:
python manage.py migrate

You can visit [Django Tutorial](https://www.w3schools.com/django/) for detailed steps regarding setting up Django, and creating a Django Project from scratch. 
Note: For this project installing the dependencies in requirements.txt and following the steps mentioned above is sufficient.

### Start the Development Server
Start the Django development server:
python manage.py runserver
Visit `http://127.0.0.1:8000` in your web browser to see the project running.

### Contributors
