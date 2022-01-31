import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {Post} from '../posts/post.model'

@Injectable({providedIn:'root'})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {

  }

  getPosts() {
    this.httpClient.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
    .pipe(map((postData) => {
      return postData.posts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((transformedData) => {
        this.posts = transformedData;
        this.postUpdated.next([...this.posts]);
    });
  }

  getPost(id: string) {
    return {...this.posts.find((post) => post.id == id)};
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPosts(title: string, content: string){
    const post: Post = {id: null, title: title, content: content};
    this.httpClient.post<{message:string, postId: string}>("http://localhost:3000/api/posts", post)
    .subscribe((responseData) => {
      post.id = responseData.postId;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content};
    this.httpClient.put<{message:string}>("http://localhost:3000/api/posts/" + id, post)
    .subscribe((result) => {
      console.log(result.message);
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
