import MySQLdb
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

db = MySQLdb.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'root'),
    passwd=os.getenv('DB_PASSWORD', 'Jatin@2007'),
    db=os.getenv('DB_NAME', 'carcraft_db'),
    port=int(os.getenv('DB_PORT', 3306)),
    charset='utf8mb4'
)

cursor = db.cursor()
cursor.execute('SET FOREIGN_KEY_CHECKS = 0;')

legacy_tables = [
    'parts_partorder',
    'parts_part',
    'customers_customer',
    'inventory_vehicle',
    'sales_sale',
    'service_serviceappointment'
]

for table in legacy_tables:
    cursor.execute(f"DROP TABLE IF EXISTS `{table}`")
    print(f"Dropped legacy table: {table}")

cursor.execute("DELETE FROM django_migrations WHERE app IN ('customers', 'inventory', 'parts', 'sales', 'service')")
print(f"Removed {cursor.rowcount} legacy migration records from django_migrations.")

cursor.execute('SET FOREIGN_KEY_CHECKS = 1;')
db.commit()
db.close()
print("Database is now clean and primed for CarCraft production models.")
