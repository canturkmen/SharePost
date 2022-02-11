import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

import { AngularMaterialModule } from './angular-material.module';

import { AppComponent } from './app.component';
import { PostModule } from './posts/post.module';
import { HeaderComponent } from './header/header.component';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PostModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
