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
  isLoading = false;

  private mode = "create";
  private postId: string;

  constructor(public postService: PostService, public router: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params: ParamMap) => {
      if(params.has('postId')) {
        this.isLoading = true;
        this.mode = 'edit';
        this.postId = params.get('postId');
        this.postService.getPost(this.postId).subscribe((response) => {
          this.post = {id: response._id, title: response.title, content: response.content};
          this.isLoading = false;
        });
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
    this.isLoading = true;
    if(this.mode === "create") {
      this.postService.addPosts(form.value.title, form.value.content);
    }
    else {
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
