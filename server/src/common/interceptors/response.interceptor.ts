import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseEnvelope<T>> {
    return next.handle().pipe(
      map((res) => {
        // Extract meta, message, and data fields if they exist
        const success = res && typeof res === 'object' && 'success' in res ? res.success : true;
        const message = res && typeof res === 'object' && 'message' in res ? res.message : 'Operation completed successfully';
        const meta = res && typeof res === 'object' && 'meta' in res ? res.meta : undefined;
        
        let data = res;
        if (res && typeof res === 'object') {
          if ('data' in res) {
            data = res.data;
          } else if ('message' in res || 'meta' in res || 'success' in res) {
            // If it has other standard fields but no 'data', remove those fields from the nested object
            const temp = { ...res };
            delete temp.message;
            delete temp.meta;
            delete temp.success;
            data = Object.keys(temp).length > 0 ? temp : null;
          }
        }

        return {
          success,
          message,
          data: data ?? null,
          ...(meta ? { meta } : {}),
        };
      }),
    );
  }
}
