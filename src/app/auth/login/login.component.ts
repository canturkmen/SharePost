import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})

export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  authStatusSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.getAuthListener().subscribe((result) => {
      this.isLoading = false;
   });
  }

  onLogin(loginForm: NgForm) {
    if(loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.loginUser(loginForm.value.email, loginForm.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
