### PR Table (Priority Rules)

The `PR` table is responsible for storing the priority rules that are used to calculate the priority of a transmission. The priority is determined based on the conditions provided in the `rules` JSON field. Additionally, interrogation rules can include other rule sets from different categories, and patient-specific rules can either be included or excluded based on certain conditions.

#### Columns:

- **Id** (string): Unique identifier for each priority rule.
- **patientRules** (JSON): Contains rules to include or exclude certain patients based on specific conditions, such as age.
- **interrogationRules** (JSON): Rules that reference other rules from different categories, allowing complex rule sets to be created.
- **rules** (JSON): Conditions that define how to set the priority of a transmission (e.g., High or Medium priority).
- **type** (string): Specifies the type of rule (e.g., Category A, Category B).
- **userId** (string): Identifies the hospital or user who created or modified the rule.
- **status** (enum: active/deactive): Indicates whether the rule is currently active or inactive.
- **parentId** (string): Used to maintain history. When a rule is edited, the previous version is deactivated, and the new rule is created with a reference to the parent rule.
- **createdAt** (date): Timestamp when the rule was created.
- **updatedAt** (date): Timestamp when the rule was last updated.
- **priority** (enum: high/medium): Defines the priority level the rule will trigger.

---

### IPC Table (Interrogation Priority Calculation)

The `IPC` table tracks which rules caused the priority of a transmission to be set. This allows for an audit trail to understand which conditions were met to trigger a High or Medium priority.

#### Columns:

- **ruleId** (string): Reference to the specific rule in the `PR` table that was applied.
- **transmissionId** (string): Reference to the transmission that the rule was applied to.
- **Cause** (string): A description or reason explaining why the priority was triggered.
- **status** (enum: active/deactive): Indicates whether the rule is still active or has been deactivated for this specific transmission.

---

### Example JSON Structures

#### Rules JSON:

{
  "conditions": [
    {
      "path": "leadVoltage", 
      "operator": "greaterThan", 
      "values": [3.0]
    },
    {
      "path": "batteryLife",
      "operator": "lessThan",
      "values": [20]
    }
  ]
}


In this example:

- `path` refers to the field being evaluated.
- `operator` defines the condition (e.g., greaterThan, lessThan).
- `values` contains the threshold or comparison value(s).

---

#### Patient Rules JSON:

{
  "qualifier": "any",
  "excludedPatients": ["patient123"],
  "includedPatients": ["patient456"],
  "conditions": [
    {
      "path": "age",
      "operator": "greaterThan",
      "values": [60]
    },
    {
      "path": "disease",
      "operator": "equals",
      "values": ["heartFailure"]
    }
  ]
}


In this example:

- `qualifier` defines whether **any** or **all** conditions must be met for the rule to apply.
- `excludedPatients` lists patients that are excluded from the rule.
- `includedPatients` lists patients specifically included in the rule.
- `conditions` contains criteria like patient age or specific diseases.

---

#### Interrogation Rules JSON:

{
  "qualifier": "all",
  "conditions": [
    {
      "path": "transmissionQuality",
      "operator": "equals",
      "values": ["poor"]
    },
    {
      "path": "responseTime",
      "operator": "greaterThan",
      "values": [30]
    }
  ]
}


In this example:

- The `qualifier` defines whether **any** or **all** conditions must be met for the rule to apply.
- The conditions refer to transmission-related metrics like `transmissionQuality` and `responseTime`.

### Additional Notes:

- **Types**: The `type` field categorizes the rule. For instance, Category A might deal with lead conditions, while Category B could deal with battery conditions. The interrogation rules allow you to mix rules from different categories.
    
- **History Management**: When a rule is updated, the old version is set to inactive by changing its `status` to "deactive," and a new rule is created. The `parentId` field links the new rule to the old version, providing an audit trail of rule changes over time.
    
- **Priority Assignment**: The conditions in the `rules` JSON will determine whether a transmission receives a High or Medium priority, and the corresponding reason will be stored in the `IPC` table for traceability.
