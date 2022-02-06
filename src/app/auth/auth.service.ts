import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn:"root"})
export class AuthService {

  constructor(private httpClient: HttpClient) {}

  createUser(email: string, password: string) {
    const user: AuthData = {email: email, password: password};
    this.httpClient.post("http://localhost:3000/api/user/signup", user)
    .subscribe((response) => {
      console.log(response);
    });
  }
}
