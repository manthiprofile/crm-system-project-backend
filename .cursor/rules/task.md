1. Create a CRUD application which does the following 
    - Display a list of customer account details ( list and individual)
    - crate a new customer account
    - updating customer account details
    - delete a customaer account

2. A customer account has the following data model
    -AccountID (auto generated pk UUID or serial)
    - First Name - String required
    -Last name - String required
    -Email - String required and unique
    -Phone Number = String optional
    -Address - String optional
    -City - String optional
    -State - String optional
    -Country - String optional
    -Date Created - Timestamp(auto generated)

3. this project should be based on type script and node js (version 24.11.0)
use nestjs, typeorm as the ORM , use vitest for unit tests and playwright for end to end tests.

4. The project should follow clean architecture deisgn approach having domain,usecases and infrastructure layers with clear seperation of concerns.

5. implement a proper error handling and a validation middleware for the project.

6.create a .env file for environment variable configuration.

7.create Software Architecture Tests to ensure clean architecture pattern is not violated .

