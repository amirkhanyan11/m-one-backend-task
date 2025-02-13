import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { FindUserDto } from '../dto';

export class AgeToNumber implements PipeTransform {
  transform(dto: FindUserDto, metadata: ArgumentMetadata): any {
    return dto.age ? { ...dto, age: Number(dto.age) } : dto;
  }
}
