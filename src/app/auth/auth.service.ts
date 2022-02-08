import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn:"root"})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private userIsAuthenticated = false;
  private tokenTimer: any;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getIsAuthenticated() {
    return this.userIsAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAuthListener() {
    return this.authStatusListener;
  }

  createUser(email: string, password: string) {
    const user: AuthData = {email: email, password: password};
    this.httpClient.post("http://localhost:3000/api/user/signup", user)
    .subscribe((response) => {
      console.log(response);
    });
  }

  loginUser(email: string, password: string) {
    const userData: AuthData = {email: email, password: password};
    this.httpClient.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", userData)
    .subscribe((response) => {
      const token = response.token;
      this.token = token;
      if(token) {
        const expiresIn = response.expiresIn;
       this.tokenTimer = setTimeout(() => {
          this.logoutUser();
        }, expiresIn * 1000);
        this.userIsAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(["/"]);
      }
    });
  }

  logoutUser() {
    this.token = null;
    this.userIsAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
    clearTimeout(this.tokenTimer);
  }
}
