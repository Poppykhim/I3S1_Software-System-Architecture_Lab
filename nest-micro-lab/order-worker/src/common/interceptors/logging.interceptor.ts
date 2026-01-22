import {
  CallHandler,
  ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let method = 'HTTP';
    let url = '';

    if (context.getType() === ('http' as ContextType)) {
      const req = context.switchToHttp().getRequest();
      if (req) {
        method = req.method;
        url = req.url;
      }
    } else if (context.getType() === ('graphql' as ContextType)) {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      method = 'GRAPHQL';
      url = info.fieldName; // GraphQL field name
    }

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - start;
        console.log(`[${method}] ${url} - ${ms}ms`);
      }),
    );
  }
}
