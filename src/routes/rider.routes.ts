import { Router } from 'express';
import { RiderService } from '../application/services/RiderService';
import { TripService } from '../application/services/TripService';
import RiderController from '../controllers/rider.controller';
import { Routes } from '../utils/route.interface';

class RiderRoutes implements Routes {
  public path?: string = '/riders';
  public router: Router = Router();
  private readonly riderController: RiderController;

  constructor(riderService: RiderService, tripService: TripService) {
    this.riderController = new RiderController(riderService, tripService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.riderController.createRider);
    this.router.get(`${this.path}/:id`, this.riderController.getRider);
    this.router.get(`${this.path}/:riderId/trips`, this.riderController.getTripHistory);
  }
}

export default RiderRoutes;
