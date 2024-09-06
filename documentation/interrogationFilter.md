# Interrogation Filters
The Interrogation Filters are essential tools used in calculating priority rules for transmissions, ensuring that patient data is assessed accurately before specific rules are applied. Rather than being used for search purposes, these filters function as preliminary checks that evaluate critical aspects of patient data, such as device characteristics, episode details, and measurement statistics. By filtering and assessing these fields, the system can determine whether specific conditions are met before applying priority rules for transmission.



## Filter by Device

User can filter the Interrogation by the patient installed Device which allows you to filter interrogations by these fields.

| Field                  | Operators                                                     |
| ---------------------- | ------------------------------------------------------------- |
| Implanter              | is (not), contains (not), beings/ends with, less/greater than |
| Implanter Contact Info | is (not), contains (not), beings/ends with, less/greater than |
| Implanting Facility    | is (not), contains (not), beings/ends with, less/greater than |
| Name                   | is (not), contains (not), beings/ends with, less/greater than |
| Model                  | is (not), contains (not), beings/ends with, less/greater than |
| Manufacter             | is (not)                                                      |
| Serial                 | is (not), contains (not), beings/ends with, less/greater than |
| Type                   | is (not)                                                      |



## Filter by Episodes

User can filter the Interrogations by the patient sent episodes.

| Field                              | Operators                   |
| ---------------------------------- | --------------------------- |
| Atrial Interval At Detection       | is (not), less/greater than |
| Atrial Interval At Termination     | is (not), less/greater than |
| Detection Therapy Details          | is (not)                    |
| Therapy Results                    | is (not)                    |
| Type                               | is (not)                    |
| Type Induced                       | is (not)                    |
| Vendor Type                        | is (not)                    |
| Vetricular Interval At Detection   | is (not), less/greater than |
| Vetricular Interval At Termination | is (not), less/greater than |



## Filter by Leads

User can filter the Interrogations by the patient leads.

| Field             | Operator                                                      |
| ----------------- | ------------------------------------------------------------- |
| Connection Status | is (not)                                                      |
| Manufactuerer     | is (not)                                                      |
| Location          | is (not)                                                      |
| Model             | is (not), contains (not), beings/ends with, less/greater than |
| Polarity Type     | is (not)                                                      |
| Special Function  | is (not), contains (not), beings/ends with, less/greater than |



## Measurements

| Field      | Operator                             | Value    |
| ---------- | ------------------------------------ | -------- |
| Start Date | (not) is, between, less/greater than | Datetime |
| End Date   | (not) is, between, less/greater than | Datetime |

### Battery

| Field  | Operator | Value                                       |
| ------ | -------- | ------------------------------------------- |
| Status | (not) is | ENUM (BOS, EOS, ERI, MOS, OK, RRT, Unknown) |

### Capacitor Measurements
| Field            | Operator                             | Value                              |
| ---------------- | ------------------------------------ | ---------------------------------- |
| Charge Date Time | (not) is, between, less/greater than | Datetime                           |
| Charge Type      | (not) is                             | ENUM (Reformation, Shock, Unknown) |



## Notifications

| Field       | Operator                                                                         | Value                     |
| ----------- | -------------------------------------------------------------------------------- | ------------------------- |
| Priority    | (not) is                                                                         | ENUM (RED, YELLOW, GREEN) |
| Description | (not) is, (not) contains, less/greater than, begins/ends with, less/greater than | TEXT                      |



## Settings

### Brady Setting

| Field       | Operator                                                                         | Value                                |
| ----------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| Mode        | (not) is                                                                         | ENUM (AAI, AAIR, AAT, Unkown, etc. ) |
| Sensor Type | (not) is, (not) contains, less/greater than, begins/ends with, less/greater than | TEXT                                 |
| Vendor Mode | (not) is, (not) contains, less/greater than, begins/ends with, less/greater than | TEXT                                 |

### Crt Setting

| Field          | Operator | Value                         |
| -------------- | -------- | ----------------------------- |
| Paced Chambers | (not) is | ENUM (BiV, LV_ Only, RV_Only) |

### Magnet

| Field    | Operator                                                                         | Value |
| -------- | -------------------------------------------------------------------------------- | ----- |
| Response | (not) is, (not) contains, less/greater than, begins/ends with, less/greater than | TEXT  |



## Session

| Field Name                    | Operator                                                    | Value                                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Clinician Name                | (not)is, (not)contains, begins/ends with, less/greater than | text                                                                                                                                          |
| Clinician Contact Information | (not)is, (not)contains, begins/ends with, less/greater than | text                                                                                                                                          |
| Session Date Time             | (not)is, between, less/greater than                         | DATE                                                                                                                                          |
| Previous Session Date Time    | (not)is, between, less/greater than                         | DATE                                                                                                                                          |
| Previous Session Type         | (not)is                                                     | ENUM(Implant, InClinic, ManualRemote, ManuallyBilled, Other, Remote, RemoteDeviceInitiated, RemotePatientInitiated, RemoteScheduled, Unknown) |
| Reprogrammed                  | (not)is                                                     | ENUM(NO, Unknown, YES)                                                                                                                        |
| Session Type                  | (not)is                                                     | ENUM(Implant, InClinic, ManualRemote, ManuallyBilled, Other, Remote, RemoteDeviceInitiated, RemotePatientInitiated, RemoteScheduled, Unknown) |




## Statistics

### Atrial Tachy Statistics

| Field Name     | Operator                   | Value  |
| -------------- | -------------------------- | ------ |
| Burden Percent | (not)is, less/greater than | number |
### Brady Statistics

| Field Name       | Operator                   | Value  |
| ---------------- | -------------------------- | ------ |
| RV Percent Paced | (not)is, less/greater than | number |

### CRT Statistic

| Field Name         | Operator                   | Value  |
| ------------------ | -------------------------- | ------ |
| LV Percent Paced   | (not)is, less/greater than | number |
| Bi-V Percent Paced | (not)is, less/greater than | number |

### Episode Statistic


| Field Name              | Operator                             | Value          |
| ----------------------- | ------------------------------------ | -------------- |
| Type                    | (not)is                              | ENUM           |
| Vendor Type             | (not)is                              | ENUM           |
| Recent Count            | (not)is, less/greater than           | number         |
| Total Count             | (not)is, less/greater than           | number         |
| Recent Count Start Date | (not)is, less/greater than, between  | DATE(MM/DD/YY) |
| Recent Count End Date   | (not)is, less/greater than,  between | DATE(MM/DD/YY) |
| Total Count Start Date  | (not)is, less/greater than,  between | DATE(MM/DD/YY) |
| Total Count End Date    | (not)is, less/greater than,  between | DATE(MM/DD/YY) |




## has shock


| Field Name | Operator | Value                    |
| ---------- | -------- | ------------------------ |
| has shock  | (not) is | bool?(true, false, null) |




## has ATP


| Field name | Operator | Value                    |
| ---------- | -------- | ------------------------ |
| has ATP    | (not) is | bool?(true, false, null) |


