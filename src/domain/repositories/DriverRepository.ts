import { Driver } from '../../model/Driver';

export interface DriverRepository {
  save(driver: Driver): Promise<void>;
  update(driver: Driver): Promise<void>;
  findById(id: number): Promise<Driver | undefined>;
  findAll(): Promise<Driver[]>;
}
