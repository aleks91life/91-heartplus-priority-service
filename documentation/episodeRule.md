# Episode Priority Rules
The Episode Priority Rules allow for filtering and assessing episode transmissions from patients. These rules help evaluate important aspects of episode data, such as episode duration, type, and therapy information, ensuring that episodes are appropriately prioritized for further processing.

## Filter by Episode Details

Episodes are filtered based on the following fields:

| Field             | Operators                                                    | Value                           |
| ----------------- | -----------------------------------------------------------  | ------------------------------- |
| Episode ID        | contains, not contains                                       | TEXT                            |
| Duration          | equals, less than, greater than, exclude null durations      | NUMBER                          |
| Type              | Select from predefined episode types                         | ENUM (ASYSTOLE, AT, ATAF, etc)  |
| First Episode     | Checkbox option to mark if it is the first episode           | Boolean                         |
| Detection Therapy | is, is not, contains, not contains                           | String[]                        |
| Treated           | Yes, No, N/A                                                 | Boolean, null                   |
| Tags              | Select from predefined tags                                  | TEXT                            |

### Field Descriptions:

1. **Episode ID**  
   - Filter by specific episode IDs or exclude certain IDs using `contains` or `not contains`.
   
2. **Duration**  
   - Specify episode duration in seconds, or exclude episodes with null (empty) durations.  
   
3. **Type**  
   - Select the type of episode from a predefined list of available episode types. This allows for filtering based on different episode classifications.

4. **First Episode**  
   - Checkbox to indicate whether this is the first episode.

5. **Detection Therapy**  
   - Allows for filtering based on detection therapy status using the following conditions:
     - `is`: Filters by the exact therapy.
     - `is not`: Excludes episodes with a specific therapy.
     - `contains`: Allows partial matches with the therapy name.
     - `not contains`: Excludes episodes containing specific terms related to the therapy.

6. **Treated**  
   - Allows users to mark episodes based on treatment status:
     - `Yes`: Episode is treated.
     - `No`: Episode is not treated.
     - `N/A`: Treatment status is not applicable.

7. **Tags**  
   - Apply relevant tags from a predefined list to categorize episodes.

### Actions

- **Save**: Save the configured priority rule settings.
- **Cancel**: Discard any changes made and exit the configuration interface.
