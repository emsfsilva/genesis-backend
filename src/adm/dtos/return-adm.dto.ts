import { ReturnCia } from 'src/cia/dtos/return-cia.dto';
import { AdmEntity } from '../entities/adm.entity';

export class ReturnAdmDTO {
  id: number;
  userId: number;
  cia?: ReturnCia;

  constructor(admEntity: AdmEntity) {
    this.id = admEntity.id;
    this.userId = admEntity.userId;
    this.cia = admEntity.cia ? new ReturnCia(admEntity.cia) : undefined;
  }
}
