import psycopg2
import json
from psycopg2.extras import RealDictCursor
from datetime import datetime
import uuid

# Database connection parameters
DB_PARAMS = {
    "dbname": "db",
    "user": "db",
    "password": "db",
    "host": "localhost",
    "port": "5432"
}

def connect_to_db():
    return psycopg2.connect(**DB_PARAMS)

def fetch_priority_rules(cur):
    cur.execute("SELECT * FROM \"PriorityRule\";")
    return cur.fetchall()

def create_new_rules_table(cur):
    cur.execute("""
    CREATE TABLE IF NOT EXISTS "Rules" (
        id VARCHAR(25) PRIMARY KEY,
        "userId" VARCHAR(25),
        "patientId" VARCHAR(25),
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        "patientRules" JSONB,
        "interrogationRules" JSONB,
        rules JSONB,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        priority FLOAT
    );
    """)

def convert_filters_to_new_format(filters):

    new_format = {
        "operator": "and",
        "conditions": []
    }
    
    if filters:
        filters_dict = json.loads(filters)
        if "prisma" in filters_dict and "searchState" in filters_dict["prisma"]:
            operator = filters_dict["prisma"].get("qualifier", "all")
            new_format["operator"] = "or" if operator == "any" else "and"
            for condition in filters_dict["prisma"]["searchState"]:
                new_condition = {
                    "fieldName": condition.get("fieldName", []),
                    "operator": "eq" if condition.get("operator") == " " else condition.get("operator", "eq"),
                    "value": [condition.get("value")] if condition.get("value") else []
                }
                new_format["conditions"].append(new_condition)
    
    return new_format

def convert_to_new_rule(old_rule):
    patient_rules = {
        "includedPatients": [],
        "excludedPatients": [],
        "conditions": {"operator": "and", "conditions": []}
    }
    
    if old_rule["filters"]:
        filters_dict = json.loads(old_rule["filters"])
        if "excludedPatients" in filters_dict:
            patient_rules["excludedPatients"] = filters_dict["excludedPatients"]
    
    if old_rule["patientSpecific"]:
        # You might want to adjust this logic based on your specific requirements
        patient_rules["includedPatients"] = []  # Add logic to populate this if needed
    
    # Prepare the rules field
    rules = {
        "position": json.loads(old_rule["position"]) if old_rule["position"] else {},
        "valueRange": json.loads(old_rule["valueRange"]) if old_rule["valueRange"] else {}
    }
    
    new_rule = {
        "id": old_rule["id"],
        "userId": old_rule["user"],
        "patientId": None,  # Adjust if you have a way to determine this
        "type": old_rule["type"],
        "name": f"{old_rule['type']} Rule",  # You might want to generate a more meaningful name
        "description": None,  # Add a description if available
        "patientRules": patient_rules,
        "interrogationRules": convert_filters_to_new_format(old_rule["filters"]),
        "rules": rules,  # Store original position and valueRange data
        "createdAt": old_rule["createdAt"],
        "updatedAt": old_rule["updatedAt"],
        "active": True,  # Assuming all migrated rules are active
        "priority": float(old_rule["priority"]) if old_rule["priority"] is not None else None
    }
    return new_rule

def insert_new_rule(cur, rule):
    cur.execute("""
    INSERT INTO "Rules" (id, "userId", "patientId", type, name, description, "patientRules", "interrogationRules", rules, "createdAt", "updatedAt", active, priority)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        rule["id"],
        rule["userId"],
        rule["patientId"],
        rule["type"],
        rule["name"],
        rule["description"],
        json.dumps(rule["patientRules"]),
        json.dumps(rule["interrogationRules"]),
        json.dumps(rule["rules"]),
        rule["createdAt"],
        rule["updatedAt"],
        rule["active"],
        rule["priority"]
    ))

def migrate_rules():
    conn = connect_to_db()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Create the new Rules table
        create_new_rules_table(cur)
        
        # Fetch all PriorityRules
        old_rules = fetch_priority_rules(cur)
        
        # Migrate each rule
        for old_rule in old_rules:
            new_rule = convert_to_new_rule(old_rule)
            insert_new_rule(cur, new_rule)
        
        conn.commit()
        print(f"Successfully migrated {len(old_rules)} rules.")
    except Exception as e:
        conn.rollback()
        print(f"An error occurred: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    migrate_rules()