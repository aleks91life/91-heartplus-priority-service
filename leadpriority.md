## Introduction

This document outlines how the Lead Priority Rules will be implemented within the HeartPlus system. The purpose is to provide a non-technical overview of how we will handle lead priority based on data collected from heart monitoring devices and how hospitals can customize these rules to suit their needs. This documentation will serve as a centralized source of truth for implementing this functionality in the HeartPlus codebase.

---

## Purpose

The Lead Priority Rules functionality allows hospitals to set custom rules that prioritize patients based on specific metrics collected from cardiac devices such as pacemakers. These rules are tailored to each hospital's individual needs, which may differ depending on how they evaluate patient data, such as impedance, sensing, and pacing thresholds.

---

## Components of Lead Priority Rules

### 1. **Patient-Specific Rules**

- If a patient-specific rule is selected, the custom rule will apply only to the patients listed.
- Excluded patients can also be specified to exempt them from certain rules.
- If no patient-specific rule is defined, the rule applies universally within the hospital system.

---

### 2. **Chamber Selection**

- Hospitals can apply rules to different heart chambers, namely:
    - **LV** (Left Ventricle)
    - **RV** (Right Ventricle)
    - **RA** (Right Atrium)
- Rules can be applied to one, two, or all three chambers. For example, if a rule is applied to LV and RV, it will only consider data from those two chambers when determining priority.

---

### 3. **Lead Metrics**

The following metrics are used to define priority for each chamber:

#### a) **Sensing**

- **Intrinsic Amplitude Mean**: Comparison : between, less or more,[Volts]
- **Polarity**: BI, UNI, or Unknown
- **Tags**: Additional tags like AFIB, Battery, VT, Leads can be added to categorize data.

#### b) **Impedance**

- **Value**: Between, less or more [Ohm]
- **Tags**: Similar to sensing, tags are used to categorize data.

#### c) **Threshold**

- **Amplitude**: Between, less or more [Volts]
- **Polarity**: BI, UNI, or Unknown
- **Pulse Width**: Between, less or more, [Seconds]
- **Tags**: As above, tags for categorization.

#### d) **HV Lead Impedance**

- **Impedance**: Between, less or more,[Ohm]
- **Location**: RV, SVC, or Unspecified
- **Tags**: Used for further categorization.

---

### 4. **Lead Priority Based on Heart Monitoring**

Lead priority is determined by analyzing data from heart monitoring devices, such as pacemakers, which monitor the electrical signals and mechanical activity in different heart chambers (e.g., LV, RV, RA). Hospitals can set custom rules based on this data (impedance, sensing, pacing) to prioritize patient care, ensuring critical cases are addressed promptly.

---

## Workflow Overview

1. **Defining Rules**: Hospitals define lead priority rules based on their medical criteria for different heart chambers. This includes setting thresholds for metrics like intrinsic amplitude, impedance, and pacing.
    
2. **Applying Rules**: These rules are applied when the system receives real-time or recorded data from patient devices. Each chamber's data is evaluated based on the hospital-defined rules.
    
3. **Setting Priority**: The HeartPlus system calculates the priority of each patient based on the rules. The system flags patients that meet high-priority criteria, helping medical professionals focus on the most critical cases.
    
4. **Customization for Hospitals**: While the HeartPlus system has built-in support for key metrics, each hospital can customize its rules to match its protocols. This customization allows hospitals to set their own definitions of "high priority" based on their specific patient population and care standards.
    

---

## Example JSON Input (Example for LV, RV, and RA)

{
  "leadChannels": [
    {
      "chamber": "RV",
      "sensing": {
        "polarity": "Unknown",
        "electrodes": []
      },
      "pacing": {
        "amplitude": 2,
        "electrodes": []
      }
    },
    {
      "chamber": "RA",
      "sensing": {
        "polarity": "Unknown",
        "electrodes": []
      }
    },
    {
      "chamber": "LV",
      "sensing": {
        "polarity": "Unknown",
        "electrodes": []
      }
    }
  ]
}
This JSON input represents example data from a heart monitor. The **chamber** field specifies which heart chamber the data corresponds to (RV, RA, LV). Hospitals can define how they interpret this data and set the priority rules accordingly.
## Conclusion

The Lead Priority Rules functionality in HeartPlus allows hospitals to apply custom rules based on critical metrics collected from cardiac devices. By tailoring these rules to their specific needs, hospitals can ensure that patients who require urgent attention are prioritized, improving the overall efficiency of care.
to store in Database is better to store it as JSON for read and write cause and is faster and simpler but if there will be frequent queries filtering specific values inside the nested data (e.g., querying by impedance value across all patients), a **relational structure** might be more efficient, we seek further to discussions!



