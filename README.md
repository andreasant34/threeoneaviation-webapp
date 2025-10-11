# [threeoneaviation.com](https://www.threeoneaviation.com)

## Running the app locally
### Via Docker
- From the root directory of this repository, execute `docker build -t threeoneaviation`
- Start the container by executing `docker run -p 8000:8000 --env-file .env.dev threeoneaviation`
### Via your IDE
- Execute python manage.py migrate
- Execute python manage.py collectstatic
- Run

## File Structure
### Dockerfile
The `Dockerfile` contains the necessary build configuration which enables docker to build our Python app

### requirements.txt
The `requirements.txt` file lists all Python dependencies needed to run the app.

### manage.py
The `manage.py` file registers the app's settings as those within `aviationwebapp.settings.py`

### staticfiles
The `staticfiles` folder is the central location for all static assets **after** 
running the `python manage.py collectstatic` command.

### aviationwebapp
The app package, root of the app's code and assets.

#### config.py
The `config.py` file contains all configuration settings which may be overwritten via a `.env` file or via 
cloud provider app settings

#### settings.py
The `settings.py` file contains the core settings of the web application, 
including those settings imported from environment variables.
The AWS-hosted app via docker reads these from the AWS Systems Manager Parameter Store.

#### urls.py
The `urls.py` file maps all supported paths to the respective views

#### views.py
The `views.py` file contains all supported views. 
Each view has its respective view model which is then passed to the respective template

#### clients
The `clients` module is responsible for connections between our app and external providers, mainly Google Drive

#### models
The `models` module contains all internal models used to pass data between the various services.

#### services
The `services` module is mainly composed of `content_service.py`, 
responsible for connecting with external clients to retrieve content and transforming it accordingly.

#### view_models
The `view_models` module contains all view models used to pass data to our HTML templates

#### templates
The `templates` directory contains all HTML templates for all our views




