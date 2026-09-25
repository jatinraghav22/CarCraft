# CarCraft

CarCraft is a Django dealership management application for vehicle inventory, customers, sales, service appointments, and parts.

## Requirements

- Python 3.10 or newer
- MySQL 8.x with a `carcraft_db` database
- Dependencies listed in `requirements.txt`

Create the database with UTF-8 support:

```sql
CREATE DATABASE carcraft_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Setup

From PowerShell in the project directory:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Configure the `DATABASES` settings in `carcraft/settings.py` for your local MySQL user and password. Keep local credentials out of source control. Then initialize and start the app:

```powershell
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Open <http://127.0.0.1:8000/>. Inventory and other protected modules require login. Uploaded vehicle images are stored under `media/vehicles/`; Django serves media files only while `DEBUG` is enabled. Use a web server or object storage for production media.

## Workflows

- **Inventory:** create, search, filter, view, edit, and delete vehicles; attach a photo.
- **Customers:** create, search, view, edit, and delete customer records.
- **Sales:** advance a sale from Inquiry to Booking, Sold, and Delivered. Booking reserves an available vehicle, and each later stage updates its vehicle status.
- **Service:** schedule an appointment for a customer and vehicle, then advance it through Scheduled, In Progress, and Completed while recording cost.
- **Parts:** maintain stock and place orders. Orders reduce stock and are recorded in the part's order history; orders larger than available stock are rejected.

## Checks and Tests

```powershell
python manage.py check
python manage.py test
```

Tests use Django's test database, so the configured database server and account must be able to create a temporary test database.

## Troubleshooting

### MySQL connection error

For `django.db.utils.OperationalError`, verify that MySQL Server is running, the configured username/password are correct, the server listens on port `3306`, and `carcraft_db` exists.

### Access denied

Check the MySQL user permissions and the `USER` and `PASSWORD` values in the local `DATABASES` settings.

### MySQLdb driver error

Install either `PyMySQL` (enabled in `carcraft/settings.py`) or `mysqlclient`, then install the project requirements again.

### TemplateDoesNotExist

Confirm `TEMPLATES[0]['DIRS']` contains `BASE_DIR / 'templates'` and that the requested template exists at the matching path.

### Vehicle images do not display

Confirm Pillow is installed, `MEDIA_URL` is `/media/`, `MEDIA_ROOT` points to the project `media` directory, and development URL patterns serve media when `DEBUG` is enabled. Production media must be served by the production web server or storage service.

### CSRF verification failed

Every POST form must include `{% csrf_token %}` inside the form.

## Project Layout

```text
CarCraft/
├── manage.py
├── requirements.txt
├── README.md
├── .gitignore
├── carcraft/                 # Django settings and root URLs
├── dashboard/                # Dashboard views and tests
├── inventory/                # Vehicle models, forms, views, tests, migrations
├── customers/                # Customer models, forms, views, tests, migrations
├── sales/                    # Sale models, forms, views, tests, migrations
├── service/                  # Appointment models, forms, views, tests, migrations
├── parts/                    # Parts, order workflow, forms, views, tests, migrations
├── templates/
│   ├── base.html
│   ├── dashboard/
│   ├── inventory/
│   ├── customers/
│   ├── sales/
│   ├── service/
│   ├── parts/
│   ├── includes/
│   └── registration/
├── static/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
├── media/vehicles/           # Uploaded vehicle photos
└── venv/                     # Local virtual environment; ignored by Git
```
