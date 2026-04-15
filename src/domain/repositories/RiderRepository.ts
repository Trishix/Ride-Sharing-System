import { Rider } from '../../model/Rider';

export interface RiderRepository {
  save(rider: Rider): Promise<void>;
  findById(id: number): Promise<Rider | undefined>;
}
