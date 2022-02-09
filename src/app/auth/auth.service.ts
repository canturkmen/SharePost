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
  private userId: string;
  private tokenTimer: any;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getIsAuthenticated() {
    return this.userIsAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
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
    this.httpClient.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", userData)
    .subscribe((response) => {
      const token = response.token;
      this.token = token;
      if(token) {
        const expiresIn = response.expiresIn;
        this.userId = response.userId;
        this.setAuthenticationTimer(expiresIn);
        this.userIsAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        this.saveAuthData(token, expirationDate, this.userId);
        this.router.navigate(["/"]);
      }
    });
  }

  autoAuthenticateUser() {
    const authData = this.getAuthData();
    if(!authData) {
      return;
    }

    const now = new Date();
    const timeElapsed = authData.expirationDate.getTime() - now.getTime();

    if(timeElapsed > 0) {
      this.token = authData.token;
      this.userId = authData.userId;
      this.userIsAuthenticated = true;
      this.setAuthenticationTimer(timeElapsed / 1000);
      this.authStatusListener.next(true);
    }
  }

  logoutUser() {
    this.token = null;
    this.userIsAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
  }

  private setAuthenticationTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate || !userId) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
