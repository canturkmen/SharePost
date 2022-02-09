import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, ParamMap } from "@angular/router";

import { mimeType } from "./mime-type.validator";
import { PostService } from "../posts.service";
import { Post } from "../post.model";

@Component(
{
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})

export class PostCreateComponent implements OnInit
{
  form: FormGroup;
  enteredContent = "";
  enteredTitle = "";
  post: Post;
  imagePreview: string
  isLoading = false;

  private mode = "create";
  private postId: string;

  constructor(public postService: PostService, public router: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      "title": new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      "content": new FormControl(null, {validators: [Validators.required]}),
      "image": new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
    this.router.paramMap.subscribe((params: ParamMap) => {
      if(params.has("postId")) {
        this.isLoading = true;
        this.mode = "edit";
        this.postId = params.get("postId");
        this.postService.getPost(this.postId).subscribe((response) => {
          this.isLoading = false;
          this.post = {
            id: response._id,
            title: response.title,
            content: response.content,
            imagePath: response.imagePath,
            creator: response.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
          });
      }
      else {
        this.mode = "create";
        this.postId = null;
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({"image": file});
    this.form.get("image").updateValueAndValidity();

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      this.imagePreview = fileReader.result as string;
    }
  }

  onPostSaved() {
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === "create") {
      this.postService.addPosts(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
  }
}
