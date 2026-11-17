import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { toApiError } from './api-error';
import { unwrapEnvelope } from './unwrap-envelope';

const API_PREFIX = '/api/';

/**
 * Desembrulha o envelope da API (`{ statusCode, success, message, data }`) e converte erros em `ApiError` (D-06).
 * Só age em `/api/`; qualquer outra URL (por exemplo `/health`) passa intacta.
 */
export const apiEnvelopeInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_PREFIX)) {
    return next(req);
  }

  return next(req).pipe(
    map((event: HttpEvent<unknown>) =>
      event instanceof HttpResponse ? event.clone({ body: unwrapEnvelope(event.body, event.status) }) : event,
    ),
    catchError((error: unknown) => throwError(() => toApiError(error))),
  );
};
