import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // إضافة headers أو معالجات أخرى
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: 'Bearer token',
      },
    });
    return next.handle(clonedRequest);
  }
}
