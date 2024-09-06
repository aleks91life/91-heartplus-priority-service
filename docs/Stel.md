# Stel Priority Rules Documentation

## Overview

The Stel Priority                               Rules define how to calculate the priority of vital sign transmissions based on specific health parameters. This document provides a non-technical overview of how these rules are applied to evaluate and categorize transmissions.

## What are Stel Priority Rules?

Stel Priority Rules are used to assess the priority level of health data transmissions related to various vital signs such as blood pressure, glucose levels, and heart rate. These rules help determine which transmissions require immediate attention based on defined thresholds.

## Key Components

### 1. **StelRule Interface**

A `StelRule` includes:
- **Type**: Always set to `'stel'`.
- **Value Range**: Defines acceptable ranges for different vital signs. Each range is specified with a minimum and maximum value.

The following parameters can be specified in the `valueRange`:
- **Glucose**: Minimum and maximum glucose levels.
- **SPO2**: Minimum and maximum oxygen saturation levels.
- **Weight**: Minimum and maximum weight values.
- **Dia**: Minimum and maximum diastolic blood pressure values.
- **Sys**: Minimum and maximum systolic blood pressure values.
- **BPM**: Minimum and maximum heart rate values.

### 2. **Vital Signs Aliases**

Vital signs data can use different terms or aliases. The system standardizes these terms using the following aliases:
- **BpDiastolic** → `dia`
- **BpSystolic** → `sys`
- **BloodGlucose** → `glucose`
- **HeartRate** → `bpm`
- **Steps** → `steps`

### 3. **Transmissions**

Vital sign transmissions are data entries that contain values for different health parameters. Each transmission is evaluated to see if it falls within the specified value ranges.

### 4. **Priority Calculation**

Priority is calculated based on the following steps:

1. **Standardize Types**: Convert the transmission types to standardized names using aliases.
2. **Transform Ranges**: Convert the rule's value ranges into a format that can be easily compared against transmission values.
3. **Check Ranges**: For each transmission, check if the values fall within the specified ranges. If all relevant values are within the range, the transmission is flagged.

### 5. **Filters**

The rules can include filters such as:
- **Excluded Patients**: Transmissions from patients who are on the exclusion list are ignored.
- **Patient-Specific Rules**: Only apply rules to specific patients if required.

### 6. **Priority Levels**

Transmissions are assigned priority levels based on the rules:
- **Priority 1**: High priority
- **Priority 2**: Medium priority
- **Priority 3**: Low priority

Transmissions that do not meet any rules' criteria will not be assigned a priority.

## Process Flow

1. **Fetch Transmissions**: Retrieve relevant vital sign transmissions from the database.
2. **Apply Rules**: Evaluate each transmission against the Stel Priority Rules.
3. **Assign Priorities**: Assign a priority level to each transmission based on the evaluation.
4. **Update Database**: Update the database with the assigned priority levels.

## Example Use Case

Consider a rule that specifies:
- Glucose levels should be between 70 and 140 mg/dL.
- Blood pressure (systolic) should be between 90 and 140 mmHg.

A transmission with a glucose level of 80 mg/dL and a systolic blood pressure of 120 mmHg would be within the specified ranges. If this transmission is from a patient not on the exclusion list, it would be assigned a priority based on the rule's specified priority.

## Summary

The Stel Priority Rules provide a structured way to evaluate and prioritize vital sign data based on predefined health parameters. By applying these rules, healthcare providers can ensure timely attention to critical health data.

---

This documentation serves as a guideline for understanding and implementing the Stel Priority Rules in our codebase. For further details or changes to the rules, please refer to the source code and related documentation.
