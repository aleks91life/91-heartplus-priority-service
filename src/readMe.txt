-> Below is a breakdown of the approach and the steps taken to achieve the current functionality, with additional improvements planned (marked as "to-do").

-> Rule Implementation Approach

*Initial Focus: Pacing Rules
The implementation began by focusing on pacing rules.
I developed a Pacing Interpreter that efficiently handled all the specific cases needed for pacing within the system.
The solution ensures that all current pacing-related scenarios are covered. (pacingInterpreter.ts file -> left the file so you can see the progress but that code is not longer relevant)

*Handling Battery Rules
Once the pacing rules were stable, I moved on to the implementation of battery rules.
Similar to the pacing rules, the battery rules were thoroughly handled to cover all necessary cases and scenarios.

*Generic Logic for Multiple Rules
After successfully handling pacing and battery rules, the next step was to create a more generic logic to unify the handling of both types of rules.
This logic aims to accommodate both pacing and battery rules, and the same approach will be applied as I start implementing the other rules. (priorityCalculationEngine.ts)
To-Do: Continue refining this logic to further improve its flexibility and scalability, ensuring it can adapt to any new rules that are added to the system.
