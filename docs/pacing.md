# Pacing Priority Rules Documentation

## 1. Introduction to Pacing

Pacing refers to the process by which a pacemaker helps regulate heart rhythm by sending electrical impulses to the heart's chambers. Pacemakers are essential for patients with heart conditions such as bradycardia (slow heart rate), arrhythmias (irregular heartbeats), or heart failure. Pacing can be applied to different chambers of the heart to maintain an appropriate rhythm.

In the Heart+ platform, pacing is monitored in real-time, and transmissions related to pacing are evaluated to assess whether a patient’s pacemaker is functioning correctly. The platform assigns a priority to these transmissions based on predefined rules, which helps healthcare professionals prioritize and address the most critical cases first.

## 2. Pacing Priority Rules Overview

The **Pacing Priority Rules** determine the urgency of a transmission based on pacing percentages for different heart chambers. These rules guide the platform in calculating the priority level, which ensures that doctors can focus on the most critical patients who need immediate attention.

### Key Heart Chambers for Pacing:
- **Right Atrium (RA)**: Controls the heart's rhythm by pacing the upper right chamber.
- **Right Ventricle (RV)**: Helps regulate blood flow from the right ventricle to the lungs.
- **Left Ventricle (LV)**: Used in **Cardiac Resynchronization Therapy (CRT)** to ensure both ventricles beat in sync, especially for heart failure patients.

## 3. Pacing Priority Calculation

For each transmission (also known as an **interrogation**), the platform evaluates pacing in the **Right Atrium (RA)**, **Right Ventricle (RV)**, and **Left Ventricle (LV)** chambers.

The system calculates the pacing priority based on the following rules:
- **Percentage of Pacing**: The platform monitors the percentage of time each chamber is paced. The acceptable range for pacing can vary depending on the patient's specific condition.
- **Thresholds for Action**: If the pacing percentage in any chamber falls outside the predefined range (e.g., 30% - 70%), the transmission is flagged as high priority. The thresholds are set based on clinical guidelines and can be adjusted for individual patients.

### Pacing Rules Breakdown:
- **Right Atrium (RA) Pacing**: The system checks if the percentage of pacing in the RA is within the acceptable range. If it is below or above the defined threshold, it triggers a higher priority alert.
- **Right Ventricle (RV) Pacing**: Similar to RA, the RV pacing is checked. If it falls outside the defined range, a priority is raised.
- **Left Ventricle (LV) Pacing**: This chamber is critical in **CRT**, and its pacing percentage is closely monitored. Deviations from the set range can indicate a problem that requires urgent attention.

## 4. Creating a Pacing Rule in Heart+ Platform

In the Heart+ platform, users can create and manage pacing rules using the "Interrogation Priority" interface. Below are the steps to create a pacing rule:

1. **Choose Priority Level**: 
   - Select the priority level for the pacing rule (e.g., High, Medium, or Low(there isn't an option to choose low for nows)). This determines how urgent the alert is if the rule is triggered.
   
2. **Patient-Specific Rule**:
   - Optionally, you can select "Patient Specific Rule" to apply this rule only to a specific patient or group of patients.

3. **Filters**:
   - Use the "Filters" section to specify conditions for the rule. You can configure the rule to trigger based on certain conditions, such as pacing values or patient conditions.
   - You can add multiple filters by using the “+” button.
   - More details are available in the filter documentation.

4. **Excluded Patients**:
   - In some cases, certain patients should not be included in the rule. Use the "Excluded Patients" field to specify patients for whom this rule should not apply.

5. **Select Chambers**:
   - Check the boxes to apply the rule to specific heart chambers. You can select:
     - **LV** (Left Ventricle)
     - **RV** (Right Ventricle)
     - **RA** (Right Atrium)

6. **Set Percent Pacing**:
   - In the "Percent Paced" field, enter the range of acceptable pacing values. The rule will be triggered if the pacing percentage for the selected chamber(s) falls outside this range.

7. **Tags**:
   - Optionally, you can add tags to help categorize and identify this rule for future reference.

8. **Save**:
   - After setting up all the conditions, click "Save" to create the pacing rule. The new rule will now be applied to incoming transmissions.

## 5. Logic and Filters

The following logic is applied to transmissions (interrogations) related to pacing:

- **Chamber-Specific Filters**: The system evaluates each transmission based on the chamber (RA, RV, LV) specified in the pacing rule.
- **Pacing Value Range**: Each chamber has a defined minimum and maximum pacing percentage (e.g., 30% - 70%). If the measured pacing percentage is outside this range, the rule is triggered.
- **Priority Assignment**: When a pacing rule is triggered (i.e., the pacing is outside the normal range), the transmission is assigned a higher priority, which helps the healthcare team identify which patients need immediate review.

## 6. Priority Explanation

The system provides an explanation for each priority assignment. For example, if a transmission related to **RA Pacing** is flagged as high priority, the system would explain that the **RA Percent Pacing** fell outside the acceptable range of 30% - 70%.

## 7. Examples

### Example 1: Normal Pacing

{
  "id": "12345",
  "statistics": {
    "crtStatistic": {
      "lvPercentPaced": 65
    },
    "bradyStatistics": [
      {
        "raPercentPaced": 50,
        "rvPercentPaced": 60
      }
    ]
  }
}


### Example 2: Abnormal RA Pacing

{
  "id": "67890",
  "statistics": {
    "crtStatistic": {
      "lvPercentPaced": 40
    },
    "bradyStatistics": [
      {
        "raPercentPaced": 25,  // Below acceptable threshold
        "rvPercentPaced": 55
      }
    ]
  }
}


