# ER Diagram

```mermaid
erDiagram
    RIDERS ||--o{ TRIPS : books
    DRIVERS ||--o{ TRIPS : drives

    RIDERS {
        int id PK
        string name
    }
    DRIVERS {
        int id PK
        string name
        bool is_accepting_rider
    }
    TRIPS {
        string id PK
        int rider_id FK
        int driver_id FK
        int origin
        int destination
        int seats
        float fare
        string status
    }
```

## About this diagram

This ER diagram captures the database entities and relationships used by the ride-sharing backend. Each rider may book many trips, and each driver may serve many trips. The `TRIPS` table stores foreign keys back to `RIDERS` and `DRIVERS`, plus ride details like origin, destination, seats, fare, and status.