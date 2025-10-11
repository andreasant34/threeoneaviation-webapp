## Running the app on local environment
- Execute python manage.py migrate
- Execute python manage.py collectstatic
- Run

## File Structure 
### Procfile
The `Procfile` defines the process types for deployment into Heroku.

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