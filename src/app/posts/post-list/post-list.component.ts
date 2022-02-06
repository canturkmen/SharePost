import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import {Subscription} from 'rxjs'

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

  private postsSub: Subscription;

  constructor(public postsService:PostService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], maxPosts: number}) => {
      this.posts = postData.posts;
      this.totalPosts = postData.maxPosts;
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  OnDelete(PostId: string) {
    this.isLoading = true;
    this.postsService.deletePosts(PostId).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }
}
