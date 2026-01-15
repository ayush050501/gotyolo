# GotYolo - Trip Booking API

A RESTful API for managing trips and bookings, built with a modern Node.js stack and fully containerized with Docker.

---

## a. Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| **Language** | JavaScript (Node.js v22)            |
| **Framework**| Express.js                          |
| **ORM**      | Sequelize                           |
| **Database** | MySQL 8.0                           |
| **Container**| Docker & Docker Compose             |

### Why This Stack?

I have hands on experience with this stack and I am confident that I can build a robust and scalable application with it.

- **Node.js + Express**: Lightweight, non-blocking I/O, ideal for building fast RESTful APIs. Large ecosystem and easy to scale horizontally.
- **Sequelize ORM**: Provides model-based abstraction over SQL, migrations, and associations, reducing boilerplate and improving maintainability.
- **MySQL 8.0**: Mature, reliable relational database with excellent support for transactions, which is critical for booking operations.
- **Docker**: Ensures consistent development and production environments. Simplifies onboarding and deployment.

---

## b. Setup & Run Instructions

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### Steps to Run the Application

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd gotyolo
    ```

2.  **Build and start the containers:**
    ```bash
    docker compose up -d
    ```
    This command will:
    - Build the Node.js application image.
    - Start a MySQL 8.0 database container.
    - Run Sequelize migrations automatically to set up the database schema.
    - Start the API server on port `5000`.

3.  **Verify the containers are running:**
    ```bash
    docker ps
    ```
    You should see two containers: `gotyolo` (app) and `gotyolo_db` (database).

4.  **Test the API:**
    ```bash
    curl http://localhost:5000/api/test
    ```
    You should receive: `{"message":"Hello World!"}`

### How to Stop and Clean Up Containers

-   **Stop containers:**
    ```bash
    docker compose down
    ```

-   **Stop and remove volumes (clears database data):**
    ```bash
    docker compose down -v
    ```

-   **Rebuild after code changes:**
    ```bash
    docker compose up -d --build
    ```

---

## c. API Documentation

Base URL: `http://localhost:5000/api`

---

### 1. Get All Trips

Retrieves a list of all published trips with optional filtering and sorting.

| Property     | Value                   |
|--------------|-------------------------|
| **Endpoint** | `GET /trips`            |
| **Auth**     | None                    |

#### Query Parameters

| Parameter    | Type   | Required | Description                               |
|--------------|--------|----------|-------------------------------------------|
| `destination`| string | No       | Filter by destination                     |
| `min_price`  | number | No       | Minimum price filter                      |
| `max_price`  | number | No       | Maximum price filter                      |
| `start_date` | string | No       | Filter trips starting on or after (YYYY-MM-DD) |
| `category`   | string | No       | Filter by category slug                   |
| `sort_by`    | string | No       | Sort by `price` or `start_date`           |
| `sort_order` | string | No       | `asc` or `desc`                           |

#### Response

```json
{
    "success": true,
    "data": [
        {
            "id": 4,
            "title": "Test 4",
            "description": "Test description",
            "price": "4999.00",
            "start_date": "2026-05-15",
            "destination": "test India 1",
            "categories": [
                "weekend"
            ]
        },
        {
            "id": 5,
            "title": "Test 4",
            "description": "Test description",
            "price": "4999.00",
            "start_date": "2026-05-15",
            "destination": "test India 1",
            "categories": [
                "weekend"
            ]
        },
        {
            "id": 6,
            "title": "Test 4",
            "description": "Test description",
            "price": "4999.00",
            "start_date": "2026-05-17",
            "destination": "test India 1",
            "categories": [
                "weekend"
            ]
        }
    ]
}
```

---

### 2. Get Trip by ID

Retrieves detailed information for a single trip.

| Property     | Value                   |
|--------------|-------------------------|
| **Endpoint** | `GET /trips/:id`        |
| **Auth**     | None                    |

#### Path Parameters

| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `id`      | integer| Yes      | The trip ID       |

#### Response

```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Weekend Getaway to the Mountains",
        "destination": "Manali, India",
        "description": "A refreshing weekend trip to the beautiful mountains of Manali. Enjoy trekking, bonfires, and scenic views.",
        "start_date": "2026-05-15",
        "end_date": "2026-05-18",
        "price": "4999.00",
        "max_capacity": 15,
        "available_seats": 13,
        "status": "published",
        "createdAt": "2026-01-15T16:05:11.000Z",
        "updatedAt": "2026-01-15T17:26:14.000Z",
        "trip_categories": [
            {
                "categoryId": 1,
                "tripId": 1,
                "category": {
                    "slug": "adventure"
                }
            },
            {
                "categoryId": 2,
                "tripId": 1,
                "category": {
                    "slug": "cultural"
                }
            }
        ]
    }
}
```

---

### 3. Create a New Trip

Creates a new trip with associated categories.

| Property     | Value                   |
|--------------|-------------------------|
| **Endpoint** | `POST /trips`           |
| **Auth**     | None                    |

#### Request Body

```json
{
    "title": "Test 4",
    "destination": "test India 1",
    "description": "Test description",
    "price": 4999.00,
    "start_date": "2026-05-17",
    "end_date": "2026-05-19",
    "max_capacity": 20,
    "available_seats": 19,
    "status": "published",
    "categories": [
        { "id": 1 },
        { "id": 4 }
    ]
}
```

#### Required Fields

`title`, `destination`, `price`, `start_date`, `end_date`, `max_capacity`, `available_seats`, `categories`

#### Response (Success)

```json
{
    "success": true,
    "data": {
        "dataValues": {
            "id": 3,
            "title": "Test 4",
            "destination": "test India 1",
            "description": "Test description",
            "price": 4999,
            "start_date": "2026-05-17",
            "end_date": "2026-05-19",
            "max_capacity": 20,
            "available_seats": 19,
            "status": "published",
            "updatedAt": "2026-01-15T16:51:07.374Z",
            "createdAt": "2026-01-15T16:51:07.374Z"
        },
        "_previousDataValues": {
            "title": "Test 4",
            "destination": "test India 1",
            "description": "Test description",
            "price": 4999,
            "start_date": "2026-05-17",
            "end_date": "2026-05-19",
            "max_capacity": 20,
            "available_seats": 19,
            "status": "published",
            "id": 3,
            "createdAt": "2026-01-15T16:51:07.374Z",
            "updatedAt": "2026-01-15T16:51:07.374Z"
        },
        "uniqno": 1,
        "_changed": {},
        "_options": {
            "isNewRecord": true,
            "_schema": null,
            "_schemaDelimiter": ""
        },
        "isNewRecord": false,
        "trip_category": [
            {
                "tripId": 3,
                "categoryId": 1
            },
            {
                "tripId": 3,
                "categoryId": 4
            }
        ]
    }
}
```

---

### 4. Book a Trip

Books seats on a published trip.

| Property     | Value                     |
|--------------|---------------------------|
| **Endpoint** | `POST /trips/:id/book`    |
| **Auth**     | None                      |

#### Path Parameters

| Parameter | Type   | Required | Description       |
|-----------|--------|----------|-------------------|
| `id`      | integer| Yes      | The trip ID       |

#### Request Body

```json
{
    "seats_booked": 2
}
```

#### Response (Success)

```json
{
    "success": true,
    "data": {
        "bookedAt": "2026-01-15T17:26:14.805Z",
        "id": 3,
        "tripId": "1",
        "userId": 1,
        "seats_booked": 2,
        "total_price": 9998,
        "status": "confirmed",
        "updatedAt": "2026-01-15T17:26:14.805Z"
    }
}
```

#### Response (Error - Trip Full)

```json
{
    "success": false,
    "data": "Trip is full"
}
```

---

### HTTP Status Codes

| Code | Description                                      |
|------|--------------------------------------------------|
| 200  | Success                                          |
| 400  | Bad Request (validation error, missing fields)   |
| 404  | Not Found (trip does not exist)                  |
| 500  | Internal Server Error                            |