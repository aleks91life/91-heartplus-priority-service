These filters are used to create rules that decide whether a transmission should be classified as **high**, **mid**, or **low** priority. The filters are applied to patient data and interrogation records, and the rules are only fulfilled if the specified conditions are met. The filters can be configured to apply when **all** or **any** of the conditions are satisfied.

## 1. Is / Is Not
- **Definition**: This operator checks for exact matches between the field and the specified value.
- **Usage**:
  - **Is**: Selects records where the field value exactly matches the given value.
  - **Is Not**: Selects records where the field value does not match the given value.

## 2. Contains / Does Not Contain
- **Definition**: This operator checks whether a field contains (or does not contain) a specific sequence of characters.
- **Usage**:
  - **Contains**: Returns records where the field contains the given substring.
  - **Does Not Contain**: Returns records where the field does not contain the given substring.

## 3. Between
- **Definition**: This operator checks if a numeric or date field falls between two specified values.
- **Usage**: Filter records where the field value is within the specified range (inclusive of the boundaries).

## 4. More Than / Less Than
- **Definition**: This operator is used for numeric fields to filter records based on values greater or smaller than a specified number.
- **Usage**:
  - **More Than**: Returns records where the field value is greater than the specified number.
  - **Less Than**: Returns records where the field value is less than the specified number.

## 5. Ends With / Begins With
- **Definition**: These operators search for fields that start or end with a specific string.
- **Usage**:
  - **Begins With**: Filters records where the field value starts with the given substring.
  - **Ends With**: Filters records where the field value ends with the given substring.
