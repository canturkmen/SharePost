import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import {Subscription} from 'rxjs'
import { AuthService } from "src/app/auth/auth.service";

import { Post } from '../post.model';
import { PostService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  currentPage = 1;
  postPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  isAuthenticated = false;
  userId: string;

  private postsSub: Subscription;
  private authStatusSubscription: Subscription;

  constructor(public postsService:PostService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();

    // Setting and updating the posts
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], maxPosts: number}) => {
      this.posts = postData.posts;
      this.totalPosts = postData.maxPosts;
      this.isLoading = false;
    });

    // Authentication
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSubscription = this.authService.getAuthListener()
    .subscribe((result) => {
      this.isAuthenticated = result;
      this.userId = this.authService.getUserId();
    })
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }

  OnDelete(PostId: string) {
    this.isLoading = true;
    this.postsService.deletePosts(PostId).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }
}
