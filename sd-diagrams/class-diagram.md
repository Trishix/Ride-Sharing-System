# Class Diagram

```mermaid
classDiagram
    %% ROUTES & CONTROLLERS
    class App {
      +start()
    }
    class DriverRoutes {
      +configureRoutes()
    }
    class RiderRoutes {
      +configureRoutes()
    }
    class TripRoutes {
      +configureRoutes()
    }
    class SystemRoutes {
      +configureRoutes()
    }
    class DriverController {
      +createDriver()
      +updateDriverAvailability()
      +getAvailableDrivers()
      +endTrip()
    }
    class RiderController {
      +createRider()
      +getRider()
      +getTripHistory()
    }
    class TripController {
      +createTrip()
      +updateTrip()
      +withdrawTrip()
      +endTrip()
    }
    class SystemController {
      +health()
      +openApi()
    }

    %% SERVICES
    class DriverService {
      +register(driver)
      +updateAvailability(driverId, available)
      +getAvailableDrivers()
    }
    class RiderService {
      +register(rider)
      +getRider(riderId)
    }
    class TripService {
      +createTrip(riderId, origin, destination, seats)
      +updateTrip(tripId, origin, destination, seats)
      +withdrawTrip(tripId)
      +endTrip(driverId)
      +tripHistory(riderId)
      -validateLocations(origin, destination)
      -calculateFare(riderId, origin, destination, seats)
      -isPreferredRider(riderId)
    }

    %% FACTORY & STRATEGY
    class StrategyFactory {
      +createPricingStrategy(type)
      +createDriverMatchingStrategy(type)
    }
    class PricingStrategy <<interface>> {
      +calculateFare(origin, destination, seats)
      +calculateFareForPreferred(origin, destination, seats)
    }
    class DefaultPricingStrategy {
      +calculateFare(origin, destination, seats)
      +calculateFareForPreferred(origin, destination, seats)
    }
    class DriverMatchingStrategy <<interface>> {
      +findDriver(rider, drivers, origin, destination)
    }
    class OptimalDriverStrategy {
      +findDriver(rider, drivers, origin, destination)
    }

    %% REPOSITORIES
    class DriverRepository <<interface>> {
      +findById(driverId)
      +findAll()
      +save(driver)
      +update(driver)
    }
    class RiderRepository <<interface>> {
      +findById(riderId)
      +save(rider)
    }
    class TripRepository <<interface>> {
      +save(riderId, trip)
      +update(trip)
      +findById(tripId)
      +findByRiderId(riderId)
    }
    class PostgresDriverRepository
    class PostgresRiderRepository
    class PostgresTripRepository

    %% DOMAIN MODELS
    class Driver {
      -int id
      -string name
      -Trip currentTrip
      -bool isAcceptingRider
      +getId()
      +getName()
      +getCurrentTrip()
      +getAcceptingRider()
      +setCurrentTrip(trip)
      +setAcceptingRider(bool)
      +isAvailable()
    }
    class Rider {
      -int id
      -string name
      +getId()
      +getName()
    }
    class Trip {
      -string id
      -Rider rider
      -Driver driver
      -int origin
      -int destination
      -int seats
      -float fare
      -TripStatus status
      +getId()
      +getRider()
      +getDriver()
      +getOrigin()
      +getDestination()
      +getSeats()
      +getFare()
      +getStatus()
      +updateTrip(origin, destination, seats, fare)
      +endTrip()
      +withdrawTrip()
      +fromPersistence(...)
    }
    class TripStatus {
      <<enum>>
      IN_PROGRESS
      COMPLETED
      WITHDRAWN
    }

    %% EXCEPTIONS
    class DriverAlreadyPresentException
    class DriverNotFoundException
    class InvalidRideParamException
    class RiderAlreadyPresentException
    class RiderNotFoundException
    class TripNotFoundException
    class TripStatusException

    %% RELATIONSHIPS
    App --> DriverRoutes
    App --> RiderRoutes
    App --> TripRoutes
    App --> SystemRoutes

    DriverRoutes --> DriverController
    RiderRoutes --> RiderController
    TripRoutes --> TripController
    SystemRoutes --> SystemController

    DriverController --> DriverService
    RiderController --> RiderService
    TripController --> TripService

    DriverService --> DriverRepository
    RiderService --> RiderRepository
    TripService --> TripRepository
    TripService --> RiderRepository
    TripService --> DriverRepository
    TripService --> PricingStrategy
    TripService --> DriverMatchingStrategy

    DriverRepository <|.. PostgresDriverRepository
    RiderRepository <|.. PostgresRiderRepository
    TripRepository <|.. PostgresTripRepository

    PricingStrategy <|.. DefaultPricingStrategy
    DriverMatchingStrategy <|.. OptimalDriverStrategy

    Trip --> Driver
    Trip --> Rider
    Trip --> TripStatus

    DriverService ..> DriverAlreadyPresentException
    DriverService ..> DriverNotFoundException
    RiderService ..> RiderAlreadyPresentException
    RiderService ..> RiderNotFoundException
    TripService ..> TripNotFoundException
    TripService ..> TripStatusException
    TripService ..> InvalidRideParamException
```

## About this diagram

This class diagram shows the full backend architecture of the ride-sharing project. It includes the route layer, controller layer, service layer, strategy/factory layer, repository layer, domain models, enums, and exception classes. It demonstrates how the application is structured using separation of concerns and interface-based dependencies.