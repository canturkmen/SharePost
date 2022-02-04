import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {Post} from '../posts/post.model'

@Injectable({providedIn:'root'})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {

  }

  getPosts() {
    this.httpClient.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
    .pipe(map((postData) => {
      return postData.posts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((transformedData) => {
        this.posts = transformedData;
        this.postUpdated.next([...this.posts]);
    });
  }

  getPost(id: string) {
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string}>(
      "http://localhost:3000/api/posts/" + id);
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPosts(title: string, content: string, image: File){
    const post = new FormData();
    post.append("title", title);
    post.append("content", content);
    post.append("image", image, title);
    this.httpClient.post<{message:string, post: Post}>("http://localhost:3000/api/posts", post)
    .subscribe((responseData) => {
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      };
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
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
        imagePath: image
      };
    }
    this.httpClient.put<{message:string}>("http://localhost:3000/api/posts/" + id, postData)
    .subscribe((result) => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = this.posts.findIndex((post) => post.id === id);
      const post: Post = {
        id: id,
        title: title,
        content: content,
        imagePath: ""
      };
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePosts(PostId: string) {
    this.httpClient.delete("http://localhost:3000/api/posts/" + PostId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter((post) => post.id !== PostId);
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
    });
  }
}
