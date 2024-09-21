# Project Summary

## Project Setup
- Installed pgAdmin inside the PostgreSQL folder.
- Using VSCode for development and Yarn for dependency management.
- Using Prisma for database management, compatible with Node.js.

## Database Structure
- Defined the `Priority` table schema with fields for patient rules, interrogation rules, and priority levels, including JSON structures for complex filtering.
- Created the `InterrogationPriorityCalculation` table, which references `transmission_id` and includes a unique primary key.

## Data Handling
- Implemented a mapping system for transmission data to compare against the `Priority` table rules.
- Developed functionality to process multiple transmissions in bulk, calculating priority based on defined rules.

## Service and Controller Implementation
- Created services and controllers with CRUD operations, handling POST, PUT, PATCH, DELETE, and GET requests.


## Business Logic
- Implemented logic to determine the priority of a transmission based on multiple rules, ensuring the highest priority rule takes precedence.
- Developed functions to calculate priority for different rule types, starting with battery measurements.

## Functions Implemented
- **Mapping Function**: Maps transmission data fields to specific paths for comparison.
- **Bulk Processing Function**: Processes multiple transmissions at once and calculates priorities.
- **Priority Calculation Function**: Determines the priority of a transmission based on rules, creating log entries for matched rules.
- **Patient Rules Checker**: Validates whether the transmission data meets the criteria defined in `patient_rules`.
- **Interrogation Rules Checker**: Validates whether the transmission data meets the criteria defined in `interrogation_rules`.
- **Rule Checker Function**: Checks the relevant fields in the transmission data against the defined rules for battery measurements.

## Next Steps
- Implement Jest tests to ensure functionality and reliability.
- Identify and implement additional improvements to enhance the project.
