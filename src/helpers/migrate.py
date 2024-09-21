import psycopg2
import json

# Database connection parameters
conn_params = {
    "host": "localhost",
    "dbname": "db",
    "user": "db",
    "password": "db",
    "port": "5432"
}

# Connect to the PostgreSQL database
conn = psycopg2.connect(**conn_params)
cur = conn.cursor()

# Fetch data from the old table
cur.execute('SELECT id, "createdAt", "updatedAt", type, "patientSpecific", priority, filters, "position", "valueRange", status, "user", tags FROM public."PriorityRule"')
rows = cur.fetchall()

# Prepare and insert data into the new table
for i, row in enumerate(rows, start=1):
    id, created_at, updated_at, rule_type, patient_specific, priority, filters, position, value_range, status, user, tags = row
    
    # Determine the active status
    active = True if status == 'ACTIVE' else False

    # Deserialize JSON fields if they are not null
    filters = json.loads(filters) if filters else None
    position = json.loads(position) if position else None
    value_range = json.loads(value_range) if value_range else None
    tags = json.loads(tags) if tags else None

    # Combine deserialized fields into a JSON structure
    data = {
        "filters": filters,
        "position": position,
        "valueRange": value_range,
        "tags": tags
    }

    # Ensure patientSpecific is not NULL
    if patient_specific is None:
        patient_specific = False

    # Create a name for the rule
    name = f"Rule {i}"

    # Insert into the new table
    cur.execute(
        '''
        INSERT INTO public."Rules" (
            id, "hospitalId", name, description, data, "createdAt", "updatedAt", active, type, "patientId", "patientSpecific", priority
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        ''',
        (
            id, None, name, None, json.dumps(data), created_at, updated_at, active, rule_type, user, patient_specific, priority
        )
    )

# Commit the transaction
conn.commit()

# Close the cursor and connection
cur.close()
conn.close()

print("Migration completed successfully!")