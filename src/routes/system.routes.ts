import { Router } from 'express';
import SystemController from '../controllers/system.controller';
import { Routes } from '../utils/route.interface';

class SystemRoutes implements Routes {
  public path?: string = '/';
  public router: Router = Router();
  private readonly systemController = new SystemController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/health', this.systemController.health);
    this.router.get('/api-docs.json', this.systemController.openApi);
  }
}

export default SystemRoutes;
