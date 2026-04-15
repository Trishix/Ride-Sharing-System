import { Router } from 'express';
import { TripService } from '../application/services/TripService';
import TripController from '../controllers/trip.controller';
import { Routes } from '../utils/route.interface';

class TripRoutes implements Routes {
  public path?: string = '/trips';
  public router: Router = Router();
  private readonly tripController: TripController;

  constructor(tripService: TripService) {
    this.tripController = new TripController(tripService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.tripController.createTrip);
    this.router.patch(`${this.path}/:tripId`, this.tripController.updateTrip);
    this.router.post(`${this.path}/:tripId/withdraw`, this.tripController.withdrawTrip);
  }
}

export default TripRoutes;
