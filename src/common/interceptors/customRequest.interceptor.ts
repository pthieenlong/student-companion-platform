import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function CustomRequest(dto: any) {
  return UseInterceptors(new CustomRequestInterceptor(dto));
}

export class CustomRequestInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    const dtoInstance = plainToClass(this.dto, body);

    
    return new Observable((observer) => {
      validate(dtoInstance).then((errors) => {
        if(errors.length > 0) {
          const errorResponse = {
              code: HttpStatus.BAD_REQUEST,
              success: false,
              message: 'VALIDATION.FAILED',
              data: errors.map(error => ({
                field: error.property,
                messages: Object.values(error.constraints),
              })),  
          };
          
          observer.next(errorResponse);
          observer.complete();
        } else {
          next.handle().pipe(
            map(data => {
              const successResponse = {
                ...data
              };
              observer.next(successResponse);
              observer.complete();
            })
          ).subscribe();
        }
      })
    })
  }
}
