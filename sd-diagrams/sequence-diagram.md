# Sequence Diagram

```mermaid
sequenceDiagram
    participant Client
    participant TripRoutes
    participant TripController
    participant TripService
    participant RiderRepository
    participant DriverRepository
    participant DriverMatchingStrategy
    participant PricingStrategy
    participant TripRepository

    Client->>+TripRoutes: POST /trips (riderId, origin, destination, seats)
    TripRoutes->>+TripController: createTrip(riderId, origin, destination, seats)
    TripController->>+TripService: createTrip(riderId, origin, destination, seats)
    TripService->>TripService: validateLocations(origin, destination)
    alt Invalid locations
        TripService-->>-TripController: throw InvalidRideParamException
        TripController-->>-TripRoutes: 400 Bad Request
        TripRoutes-->>-Client: Error response
    else Valid locations
        TripService->>+RiderRepository: findById(riderId)
        alt Rider not found
            RiderRepository-->>-TripService: undefined
            TripService-->>-TripController: throw TripNotFoundException
            TripController-->>-TripRoutes: 404 Not Found
            TripRoutes-->>-Client: Error response
        else Rider found
            RiderRepository-->>-TripService: Rider
            TripService->>+DriverRepository: findAll()
            DriverRepository-->>-TripService: drivers
            TripService->>+DriverMatchingStrategy: findDriver(rider, drivers, origin, destination)
            DriverMatchingStrategy-->>-TripService: driver
            alt No driver available
                TripService-->>-TripController: throw DriverNotFoundException
                TripController-->>-TripRoutes: 404 Not Found
                TripRoutes-->>-Client: Error response
            else Driver found
                TripService->>+PricingStrategy: calculateFare(origin, destination, seats)
                PricingStrategy-->>-TripService: fare
                TripService->>+TripRepository: save(riderId, trip)
                TripRepository-->>-TripService: saved
                TripService->>+DriverRepository: update(driver)
                DriverRepository-->>-TripService: updated
                TripService-->>-TripController: tripId
                TripController-->>-TripRoutes: 201 Created {tripId}
                TripRoutes-->>-Client: Response
            end
        end
    end
```

## About this diagram

This sequence diagram shows the full `createTrip` request lifecycle. It includes input validation, rider lookup, driver lookup, driver matching, fare calculation, trip persistence, driver update, and the response flow. It also models error paths when the request is invalid, the rider does not exist, or no driver is available.