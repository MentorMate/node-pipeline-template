import { ApiProperty } from '@nestjs/swagger';
import { ToObjectId } from '@utils/class-transformers';
import { ObjectId } from 'mongodb';

export class GenericEntity {
  @ApiProperty()
  @ToObjectId()
  id: ObjectId;

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
