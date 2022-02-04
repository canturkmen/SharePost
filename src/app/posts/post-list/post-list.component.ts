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
  totalPosts = 10;
  postPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];

  private postsSub: Subscription;

  constructor(public postsService:PostService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {this.posts = posts
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  OnDelete(PostId: string) {
    this.postsService.deletePosts(PostId);
  }
}
