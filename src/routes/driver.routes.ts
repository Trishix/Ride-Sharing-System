import { Router } from 'express';
import { DriverService } from '../application/services/DriverService';
import { TripService } from '../application/services/TripService';
import DriverController from '../controllers/driver.controller';
import { Routes } from '../utils/route.interface';

class DriverRoutes implements Routes {
  public path?: string = '/drivers';
  public router: Router = Router();
  private readonly driverController: DriverController;

  constructor(driverService: DriverService, tripService: TripService) {
    this.driverController = new DriverController(driverService, tripService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.driverController.createDriver);
    this.router.patch(`${this.path}/:id/availability`, this.driverController.updateDriverAvailability);
    this.router.get(`${this.path}/available`, this.driverController.getAvailableDrivers);
    this.router.post(`${this.path}/:driverId/end-trip`, this.driverController.endTrip);
  }
}

export default DriverRoutes;
