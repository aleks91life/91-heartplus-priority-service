
# Battery Priority Rules Documentation

## Overview
The **Battery Priority Rules** define how to prioritize device batteries based on health parameters such as **impedance**, **voltage**, **remaining longevity**, and **remaining percentage**. These rules help categorize battery levels and guide attention towards those requiring immediate action.

## What are Battery Priority Rules?
The **Battery Priority Rules** are used to assess the priority of device batteries, allowing for **comparisons** based on the following values:
- **Impedance**
- **Voltage**
- **Remaining Longevity**
- **Remaining Percentage**

Each of these values can be compared using conditions such as **between**, **is less than**, or **is greater than** a specified threshold, making the evaluation more dynamic.

## Key Components

### 1. **BatteryRule Interface**
A `BatteryRule` includes:
- **Type**: Always set to `'battery'`.
- **Device Conditions**: Specifies the health conditions of the device such as BOS (Beginning of Service), EOS (End of Service), ERI (Elective Replacement Indicator), MOS (Manufacturer Operating Specification), and others.
- **Impedance**: Allows comparison between impedance levels using conditions such as `between`, `is less than`, or `is greater than`.
- **Voltage**: Voltage thresholds can be set using the same comparisons.
- **Remaining Longevity**: Sets the number of months remaining before the battery needs replacement.
- **Remaining Percentage**: Defines the remaining battery percentage as a threshold.

### 2. **Device Conditions**
The system allows for setting specific battery conditions:
- **BOS (Beginning of Service)**
- **EOS (End of Service)**
- **ERI (Elective Replacement Indicator)**
- **MOS (Manufacturer Operating Specification)**
- **OK (Healthy Battery)**
- **RRT (Recommended Replacement Time)**
- **Unknown (Battery Condition Not Specified)**

### 3. **Impedance Settings**
Impedance levels are evaluated using the following options:
- **between**: Specifies a range, such as **between** 400Ω and 600Ω.
- **is less than**: Triggers when impedance is **less than** a specified value.
- **is greater than**: Triggers when impedance is **greater than** a specified value.

### 4. **Voltage Settings**
Voltage levels can be compared using:
- **between**: For example, voltage is **between** 2.5V and 3.0V.
- **is less than**: Triggers when voltage is **less than** a specified value.
- **is greater than**: Triggers when voltage is **greater than** a specified value.

### 5. **Remaining Longevity Settings**
For remaining longevity, which defines the months left before battery replacement, comparisons can include:
- **between**: Set a range for months, such as **between** 6 and 12 months.
- **is less than**: Flags the battery if longevity is **less than** a specified number of months.
- **is greater than**: Flags the battery if longevity is **greater than** a specified number of months.

### 6. **Remaining Percentage Settings**
Battery life as a percentage can be compared using:
- **between**: Specifies a range, such as **between** 10% and 50%.
- **is less than**: Flags batteries with a remaining percentage **less than** the threshold.
- **is greater than**: Flags batteries with a remaining percentage **greater than** the threshold.

### 7. **Filters**
The rules can include specific filters such as:
- **Patient-Specific Rules**: Apply battery priority rules to selected patients.
- **Excluded Patients**: Add patients to an exclusion list to ignore specific battery rules for their devices.

## Priority Levels
- **High Priority**: Devices with critically low battery levels (e.g., EOS or ERI conditions, voltage below thresholds).
- **Medium Priority**: Devices nearing replacement time or having moderately low battery life.
- **Low Priority**: Devices with sufficient battery health but flagged for monitoring.

## Process Flow
1. **Set Priority**: Define battery priority levels (High, Medium, Low) based on impedance, voltage, longevity, and percentage.
2. **Apply Rules**: Evaluate each battery against the defined conditions, using **between**, **is less than**, or **is greater than**.
3. **Filter by Patient or Device**: Apply specific rules only to selected patients or devices.
4. **Assign Priority**: Assign a priority based on the evaluation of all parameters.
5. **Save Settings**: Once the settings are finalized, save the battery priority configuration.

## Example Use Case
Consider a rule where:
- Voltage should be **between** 2.7V and 3.0V.
- Remaining Longevity should be **greater than** 6 months.
- Remaining Percentage should be **less than** 10%.

A device with a voltage of 2.6V and only 5 months of longevity remaining would be flagged as **High Priority**, triggering an alert for battery replacement.

## Summary
The **Battery Priority Rules** ensure that devices with critical battery conditions are flagged for review. By applying these rules with the flexibility of conditions like **between**, **is less than**, or **is greater than**, healthcare providers can ensure timely maintenance of devices, preventing failures due to battery depletion.
