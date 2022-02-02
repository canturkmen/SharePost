import { Component, Input, OnDestroy, OnInit } from "@angular/core";
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

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  OnDelete(PostId: string) {
    this.postsService.deletePosts(PostId);
  }
}
