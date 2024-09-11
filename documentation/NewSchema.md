## Priority Rules Table

| Column Name      | Data Type |
| ---------------- | --------- |
| id               | SERIAL PK |
| query            | TEXT      |
| status           | TEXT      |
| user_id          | TEXT      |
| priority         | INTEGER   |
| patient_specific | BOOLEAN   |
| filters          | JSON      |
| tags             | TEXT      |
| affected_count   | INTEGER   |
| position         | TEXT      |
| value_range      | TEXT      |
## Interrogation Priority Calculations Table

| Column Name      | Data Type                               |
| ---------------- | --------------------------------------- |
| id               | SERIAL PK                               |
| interrogation_id | TEXT FK references Interrogations table |
| rule_id          | INTEGER FK references PR table          |
| cause            | JSON                                    |

In this new proposed schema, for each priority rule we will generate a query which will be used to calculate the priority. For now, we will implement the query in JMESPath, which is a JSON query language. The flow of the program would go something like this:

1. Doctor inputs a new rule.
2. Based on what type the rule is, we expect certain values to be given and we use them to generate a query in JMESPath syntax.
3. Then, using the JMESPath library we search the interrogation for the values given by the rule.
4. If the rule is triggered, it will return to us an array of the objects that matched the rule.

With this implementation, the focus would be to convert all the rules in JMESPath syntax, then use them like this: jmespath.search(interrogation, query). 

It should be noted, that the specific implementation of queries may be changed to SQL queries, after weighing all the pros and cons. However the flow of the program would be the same, just instead of using JMESPath syntax, we use SQL syntax.


Link for more details on the JMESPath library: https://jmespath.org/. 