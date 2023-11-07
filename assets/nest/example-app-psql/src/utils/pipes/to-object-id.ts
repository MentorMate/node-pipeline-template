import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class toObjectIdPipe implements PipeTransform<any, ObjectId> {
  public transform(value: any): ObjectId {
    try {
      console.log('TRYING');
      return new ObjectId(value);
    } catch (err) {
      throw new BadRequestException('Invalid Id format');
    }
  }
}
