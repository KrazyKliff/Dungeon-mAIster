import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ValidationError } from './error-handler.service';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      const errorMessage = error.details.map((d) => d.message).join(', ');
      throw new ValidationError(errorMessage);
    }
    return value;
  }
}
