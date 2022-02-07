import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn:"root"})
export class AuthService {
  private token: string;

  constructor(private httpClient: HttpClient) {}

  getToken() {
    return this.token;
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
    });
  }
}
