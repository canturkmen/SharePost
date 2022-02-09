import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})

export class SignupComponent implements OnInit, OnDestroy{
  isLoading = false;
  authStatusSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.getAuthListener().subscribe((result) => {
        this.isLoading = false;
    });
  }

  onSignup(signupForm: NgForm) {
    if(signupForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.createUser(signupForm.value.email, signupForm.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
