import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {NgForm} from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostService } from '../posts.service';
import { Post } from '../post.model';

@Component(
{
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit
{
  enteredContent = "";
  enteredTitle = "";
  post: Post;

  private mode = "create";
  private postId: string;

  constructor(public postService: PostService, public router: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params: ParamMap) => {
      if(params.has('postId')) {
        this.mode = 'edit';
        this.postId = params.get('postId');
        this.post = this.postService.getPost(this.postId);
      }
      else {
        this.mode = "create";
        this.postId = null;
      }
    })
  }

  onPostSaved(form: NgForm) {
    if(form.invalid){
      return;
    }

    if(this.mode === "create") {
      this.postService.addPosts(form.value.title, form.value.content);
    }
    else {
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
