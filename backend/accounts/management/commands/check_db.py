import time
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings


class Command(BaseCommand):
    help = 'Inspects and verifies the database connection, engine, charset, and tables.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("=========================================="))
        self.stdout.write(self.style.MIGRATE_HEADING(" CarCraft Database Health Check "))
        self.stdout.write(self.style.MIGRATE_HEADING("=========================================="))

        db_settings = settings.DATABASES['default']
        engine = db_settings['ENGINE'].split('.')[-1]
        db_name = db_settings.get('NAME')
        host = db_settings.get('HOST', 'localhost')
        port = db_settings.get('PORT', '')

        self.stdout.write(f"Configured Engine : {engine}")
        self.stdout.write(f"Database Name     : {db_name}")
        self.stdout.write(f"Host / Port       : {host or 'localhost'}:{port or 'default'}")

        # Check connection & measure latency
        start_time = time.time()
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
                cursor.fetchone()
                latency_ms = (time.time() - start_time) * 1000

                # Check MySQL charset if applicable
                charset_info = "N/A"
                if 'mysql' in engine:
                    cursor.execute("SHOW VARIABLES LIKE 'character_set_database';")
                    row = cursor.fetchone()
                    if row:
                        charset_info = row[1]

            self.stdout.write(self.style.SUCCESS(f"Connection Status : CONNECTED (Latency: {latency_ms:.2f}ms)"))
            if 'mysql' in engine:
                self.stdout.write(f"Database Charset  : {charset_info}")

            # List tables
            tables = connection.introspection.table_names()
            self.stdout.write(f"Total Tables      : {len(tables)}")
            if tables:
                self.stdout.write("Existing Tables   : " + ", ".join(tables))
            else:
                self.stdout.write("Existing Tables   : (None - clean database)")

            self.stdout.write(self.style.SUCCESS("\nDatabase is ready for CarCraft operations!"))

        except Exception as exc:
            self.stdout.write(self.style.ERROR(f"Connection Status : FAILED! Error: {exc}"))
