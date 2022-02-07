import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn:"root"})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private userIsAuthenticated = false;

  constructor(private httpClient: HttpClient) {}

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
    this.httpClient.post<{token: string}>("http://localhost:3000/api/user/login", userData)
    .subscribe((response) => {
      const token = response.token;
      this.token = token;
      if(token) {
        this.userIsAuthenticated = true;
        this.authStatusListener.next(true);
      }
    });
  }
}
