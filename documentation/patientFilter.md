
Patient Filters
The Patient Filters are critical in calculating transmission priority rules, serving as preconditions that must be met before the rules themselves are applied. These filters allow detailed evaluation of patient-specific data, ensuring that certain criteria are checked to properly manage the transmission process. By assessing fields like device information, medical history, and clinic data, the system can ensure that only relevant transmissions are prioritized, improving efficiency and accuracy in patient monitoring.


## Age Field
The **Age** field allows filtering based on the age of the patient.

| **Operator**                | **Value** |
| --------------------------- | --------- |
| (not) is, less/greater than | string    |

---

## Device Field
The **Device** field contains multiple subfields for detailed device information.

| **Field**             | **Operator**                                                  | Value                                                                                                      |
| --------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Billing Date**      | (not) is, between,  less/greater than                         | DATE(MM/DD/YYYY)                                                                                           |
| **Explant Date**      | (not) is, between,  less/greater than                         | DATE(MM/DD/YYYY)                                                                                           |
| **Implant Status**    | (not) is                                                      | ENUM: Explanted, Implanted                                                                                 |
| **Implant Date**      | (not) is, between,  less/greater than                         | DATE(MM/DD/YYYY)                                                                                           |
| **Manufacturer**      | (not) is                                                      | ENUM: BIO, BSX, CMH, CPI, CVRx, ELA, GDT, IMC, IMP, MDT, OSC, Other, PCS, SOR, STJ, TEL, Unknown, VIT, VTX |
| **Name**              | (not) is, (not) contains, begins/ends with, less/greater than | string                                                                                                     |
| **Next Office Check** | (not) is, between,  less/greater than                         | DATE(MM/DD/YYYY)                                                                                           |
| **Model**             | (not) is, (not) contains, begins/ends with, less/greater than | string                                                                                                     |
| **Serial Number**     | (not) is, (not) contains, begins/ends with, less/greater than | string                                                                                                     |
| **Status**            | (not) is                                                      | ENUM: ACTIVE, DECEASED, INACTIVE, NonCID, TRANSFERRED                                                      |
| **Type**              | (not) is                                                      | ENUM: BAROSTIM, CCM, CRT-D, CRT-P, ICD, PPM, ILR, Other, Unknown                                           |
| **Summary Date**      | (not) is, between,  less/greater than                         | DATE(MM/DD/YYYY)                                                                                           |

### Leads

| **Field**             | **Operator**                                                  | **Value**                                                                                                  |
| --------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Connection Status** | (not) is                                                      | ENUM: Abandoned, Capped, Connected, Cut, Unknown                                                           |
| **Date Implanted**    | (not) is, between, less/greater than                          | DATE(MM/DD/YYYY)                                                                                           |
| **Date Of Explant**   | (not) is, between, less/greater than                          | DATE(MM/DD/YYYY)                                                                                           |
| **Implant Status**    | (not) is                                                      | ENUM: Explanted, Implanted                                                                                 |
| **Location**          | (not) is                                                      | ENUM: HIS, LA, LBBP, LV, OTHER, RA, RV, RV_SEPTAL1, RV_SEPTAL2, Unknown                                    |
| **Manufacturer**      | (not) is                                                      | ENUM: BIO, BSX, CMH, CPI, CVRx, ELA, GDT, IMC, IMP, MDT, OSC, Other, PCS, SOR, STJ, TEL, Unknown, VIT, VTX |
| **Model**             | (not) is, (not) contains, begins/ends with, less/greater than | string                                                                                                     |
| **Polarity Type**     | (not) is                                                      | ENUM: BI, MULTI, QUAD, TRI, UNI, Unknown                                                                   |
| **Serial Number**     | (not) is, (not) contains, begins/ends with, less/greater than | string                                                                                                     |
| **Status**            | (not) is                                                      | ENUM: ACTIVE, DECEASED, INACTIVE, NonCID, TRANSFERRED                                                      |
| **Inactive Leads**    | (not) is                                                      | ENUM: true, false, null                                                                                    |


---

| Field | Operator                                                          | Value                       |
| ----- | ----------------------------------------------------------------- | --------------------------- |
| SSN   | (not) is,(not) contain,between,begins/ends with,less/greater with | boolean,boolean,int,int,int |

## Past Medical History

| Field                          | Operator                                   | Value                   |
| ------------------------------ | ------------------------------------------ | ----------------------- |
| Abnormal Liver Function        | (not) is                                   | boolean                 |
| Abnormal Renal Function        | (not) is                                   | boolean                 |
| Alcohol to Excess              | (not) is                                   | boolean                 |
| Atrial Fibrillation            | (not) is                                   | boolean                 |
| Bleeding Predisposition        | (not) is                                   | boolean                 |
| Blood Thinner Contra indicated | (not) is                                   | boolean                 |
| Candidate DOAC                 | (not) is                                   | boolean                 |
| Congestive Heart Failure       | (not) is                                   | boolean                 |
| Currently Taking OAC           | (not) is                                   | boolean                 |
| Date of First Afib             | (not) is, between, less/greater then       | boolean                 |
| Diatebes                       | (not) is                                   | boolean                 |
| Ever Taken OAC                 | (not) is                                   | boolean                 |
| Heart Failure                  | (not) is                                   | boolean                 |
| Hypertension                   | (not) is                                   | boolean                 |
| ICD Primary                    | (not) is                                   | boolean                 |
| ICD Secondary                  | (not) is                                   | boolean                 |
| Illegall Drug Use              | (not) is                                   | boolean                 |
| Labile INR                     | (not) is                                   | boolean                 |
| MRI Conditional                | (not) is                                   | boolean                 |
| Only Cumadin                   | (not) is                                   | boolean                 |
| Only Lovenox                   | (not) is                                   | boolean                 |
| Watchman                       | (not) is                                   | boolean                 |
| Pacemaker Dependent            | (not) is                                   | boolean                 |
| Stroke                         | (not) is                                   | boolean                 |
| TIA                            | (not) is                                   | boolean                 |
| Thromboembolism                | (not) is                                   | boolean                 |
| Vascular Disease               | (not) is                                   | boolean                 |
| Ventricular Fibrillation       | (not) is                                   | boolean                 |
| Ventricular Tachycardia        | (not) is                                   | boolean                 |

### Congestive Anticoagulants

| Field | Operator | Value   |
| ----- | -------- | ------- |
| Name  | (not) is | boolean |

## Clinic

| Field | Operator                                                          | Value                       |
| ----- | ----------------------------------------------------------------- | --------------------------- |
| Name  | (not) is,(not) contain,between,begins/ends with,less/greater with | boolean,boolean,int,int,int |