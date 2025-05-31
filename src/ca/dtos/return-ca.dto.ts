import { CaEntity } from '../entities/ca.entity';

export class ReturnCaDTO {
  id: number;
  userId: number;

  constructor(caEntity: CaEntity) {
    this.id = caEntity.id;
    this.userId = caEntity.userId;
  }
}
