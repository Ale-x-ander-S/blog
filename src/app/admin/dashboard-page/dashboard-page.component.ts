import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../shared/post,service";
import {Post} from "../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert,service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = []
  pSub!: Subscription
  searchStr = ''
  delSub!: Subscription

  constructor(private postService: PostService,
              private alert: AlertService) {
  }

  ngOnInit(): void {
    this.postService.getAll().subscribe(posts => {
      return this.posts = posts

    })
  }

  remove(id: any) {
    this.delSub = this.postService.remove(id).subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== id)
        this.alert.warning('Пост был успешно удален!')
      }
    )
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }
    if (this.delSub) {
      this.delSub.unsubscribe()
    }
  }


}
