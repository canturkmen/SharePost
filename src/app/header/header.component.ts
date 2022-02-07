import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthService } from '../auth/auth.service'

@Component(
{
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  authSubscription: Subscription;
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.getAuthListener()
    .subscribe((result) =>  {
      this.isAuthenticated = result;
    })
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
