import { CiaEntity } from '../entities/cia.entity';

export class ReturnCia {
  id: number;
  name: string;

  constructor(ciaEntity: CiaEntity) {
    this.id = ciaEntity.id;
    this.name = ciaEntity.name;
  }
}
