import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
     if(isValidObjectId(value)) {
      return value;
     }
  else{
    throw new BadRequestException(
      `The value ${value} is not a valid MongoID`,
    )
  }
  
  }
}
