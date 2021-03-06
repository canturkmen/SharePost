import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {Post} from '../posts/post.model'
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({providedIn:'root'})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], maxPosts: number}>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClient.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
          return  {posts: postData.posts.map((post) => {
            return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
            };
          }), maxPosts: postData.maxPosts
        };
      })
    )
      .subscribe((transformedData) => {
        this.posts = transformedData.posts;
        this.postUpdated.next({posts: [...this.posts], maxPosts: transformedData.maxPosts});
      });
    }

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(
      BACKEND_URL + id);
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPosts(title: string, content: string, image: File){
    const post = new FormData();
    post.append("title", title);
    post.append("content", content);
    post.append("image", image, title);
    this.httpClient.post<{message:string, post: Post}>(BACKEND_URL, post)
    .subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData : Post | FormData;
    if(typeof(image) === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
      } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.httpClient.put<{message:string}>(BACKEND_URL + id, postData)
    .subscribe((result) => {
      this.router.navigate(['/']);
    });
  }

  deletePosts(postId: string) {
    return this.httpClient.delete(BACKEND_URL + postId);
  }
}
