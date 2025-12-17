# Backend (Strapi) Requirements for Admin Tools

This document outlines the API endpoints required in the Strapi backend to support the admin functionalities built in the Next.js frontend.

## 1. Authentication
frfrfr
The standard Strapi authentication process will be used. The frontend will make a `POST` request to `/api/auth/local` with a user's `identifier` (email) and `password`.

- **Endpoint:** `POST /api/auth/local`
- **Payload:**
  ```json
  {
    "identifier": "admin@example.com",
    "password": "your-password"
  }
  ```
- **Successful Response:** A `200 OK` with a JSON object containing a `jwt`.
  ```json
  {
    "jwt": "ey...",
    "user": { ... }
  }
  ```
- **Action:** No custom development is needed for this endpoint if standard authentication is enabled.

## 2. User Roles & Permissions

To secure the custom admin endpoints, a specific role must be created.

- **Role Name:** `Manager`
- **Permissions:** This role should be the **only one** with access to the custom endpoints listed below. Standard "Authenticated" users should not have access.

## 3. Custom Endpoints

These endpoints need to be created as custom controllers in Strapi.

### 3.1. CSV Car Importer

This endpoint will receive a CSV file, parse it, and create or update car entries in the database.

- **Endpoint:** `POST /api/cars/import-from-csv`
- **Method:** `POST`
- **Authentication:** Required. Access should be restricted to the `Manager` role.
- **Request Body:** The request must be `multipart/form-data`. It will contain a single file field.
  - `files.csv`: The CSV file containing the car data.
- **CSV File Format:**
  The CSV file must have a header row. The expected columns are: `name`, `brand`, `model`, `year`, `price`.
  ```csv
  name,brand,model,year,price
  Toyota Camry,Toyota,Camry,2023,25000
  Honda Civic,Honda,Civic,2022,22000
  Ford Mustang,Ford,Mustang,2024,40000
  ```
- **Controller Logic:**
  1.  Validate that the user has the `Manager` role.
  2.  Check if a file was uploaded.
  3.  Parse the CSV file.
  4.  For each row, find a car with the same `name`.
      -   If it exists, update its attributes (`brand`, `model`, `year`, `price`).
      -   If it does not exist, create a new car entry.
  5.  Keep track of how many cars were created and updated.
- **Successful Response:** `200 OK` with a summary.
  ```json
  {
    "message": "Import completed successfully.",
    "created": 15,
    "updated": 5,
    "errors": []
  }
  ```
- **Error Response:** `400 Bad Request` or `500 Internal Server Error` with a meaningful error message.
  ```json
  {
    "error": "CSV file is missing or has an invalid format."
  }
  ```

### 3.2. Car Search for Offer Creator

This endpoint provides a simple search functionality to find cars by name, which will be used in the offer creation tool.

- **Endpoint:** `GET /api/cars/search-for-offer`
- **Method:** `GET`
- **Authentication:** Required. Access should be restricted to the `Manager` role.
- **Query Parameters:**
  - `term` (string): The search term to filter cars by name. The search should be case-insensitive and match partial names.
- **Controller Logic:**
  1.  Validate that the user has the `Manager` role.
  2.  Get the `term` from the query string.
  3.  Perform a case-insensitive search on the `Car` collection where the `name` contains the search term.
  4.  Return a list of matching cars. Only the `id` and `name` attributes are strictly necessary for the frontend.
- **Successful Response:** `200 OK` with an array of car objects.
  ```json
  {
    "data": [
      {
        "id": 1,
        "attributes": {
          "name": "Toyota Camry"
        }
      },
      {
        "id": 8,
        "attributes": {
          "name": "Toyota Corolla"
        }
      }
    ]
  }
  ```

### 3.3. Offer Creator

This endpoint creates a new offer and associates a list of cars with it.

- **Endpoint:** `POST /api/offers`
- **Note:** This is likely the standard endpoint for creating an "Offer" content type. We just need to ensure the payload structure is correct.
- **Method:** `POST`
- **Authentication:** Required. Access should be restricted to the `Manager` role.
- **Request Body:** A JSON object with the offer details. The `cars` field should be an array of car IDs.
  ```json
  {
    "data": {
      "title": "Special Summer Sale",
      "cars": [1, 5, 12]
    }
  }
  ```
- **Controller Logic:**
  1.  Validate that the user has the `Manager` role.
  2.  Use Strapi's core controller to create the new offer entry, linking the provided car IDs.
- **Successful Response:** `200 OK` with the data of the newly created offer.
- **Error Response:** Standard Strapi error response if validation fails or an error occurs. 