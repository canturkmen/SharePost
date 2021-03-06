import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { ErrorComponent } from "./error/error.component";
import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
          let errorMessage = "An unknown error occured !";
          if(error.error.message) {
            errorMessage = error.error.message;
          }
          this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
          return throwError(error);
        })
      );
  };
}
