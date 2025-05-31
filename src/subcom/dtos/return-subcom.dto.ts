import { SubcomEntity } from '../entities/subcom.entity';

export class ReturnSubcomDTO {
  id: number;
  userId: number;

  constructor(subcomEntity: SubcomEntity) {
    this.id = subcomEntity.id;
    this.userId = subcomEntity.userId;
  }
}
