import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostService} from "../../shared/post,service";
import {Subscription, switchMap} from "rxjs";
import {Post} from "../shared/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../shared/services/alert,service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form!:FormGroup
  post!: Post
  submitted = false
  updSub!: Subscription

  constructor(private route: ActivatedRoute,
              private postService: PostService,
              private alert: AlertService) { }

  ngOnInit(): void {
    this.route.params.pipe(switchMap((params: Params)=>{
      return  this.postService.getBiId(params['id'])
    })).subscribe((post: Post)=>{
      this.post = post
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required)
      })
      }
    )}

  ngOnDestroy() {
    if (this.updSub) {
      this.updSub.unsubscribe()
    }
  }

  submit() {
  if (this.form.invalid) {
    return
  }
    this.submitted = true

     this.updSub = this.postService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
    }).subscribe(()=>{
    this.submitted = false
       this.form.reset()
       this.alert.succsess('Пост успешно обновлён!')
    })
  }
}
