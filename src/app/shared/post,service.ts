import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Post} from "../admin/shared/interfaces";
import {environment} from "../../environments/environment";
import {FbCreateResponse} from "../admin/shared/interfaces";

@Injectable({providedIn: "root"})

export class PostService {


  constructor(private http: HttpClient) {
  }

  create(post: Post): Observable<Post> {
    return this.http.post<any>(`${environment.FbDbUrl}posts.json`, post)
      .pipe(map((response: FbCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        }
      }))
  }

  getAll(): Observable<any> {
    return this.http.get(`${environment.FbDbUrl}posts.json`)
      .pipe(map((response: { [key: string]: any }) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          }))
      }))
  }

  getBiId(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.FbDbUrl}posts/${id}.json`)
      .pipe(map((post: Post) => {
        return {
          ...post,
          id,
          date: new Date(post.date)
        }
      }))
  }

  remove(id: string): Observable<Post> {
    return this.http.delete<Post>(`${environment.FbDbUrl}posts/${id}.json`)
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.FbDbUrl}posts/${post.id}.json`, post)
  }
}
