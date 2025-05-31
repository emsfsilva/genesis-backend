import { ReturnCia } from 'src/cia/dtos/return-cia.dto';
import { CmtciaEntity } from '../entities/cmtcia.entity';

export class ReturnCmtciaDTO {
  id: number;
  userId: number;
  cia?: ReturnCia;

  constructor(cmtciaEntity: CmtciaEntity) {
    this.id = cmtciaEntity.id;
    this.userId = cmtciaEntity.userId;
    this.cia = cmtciaEntity.cia ? new ReturnCia(cmtciaEntity.cia) : undefined;
  }
}
