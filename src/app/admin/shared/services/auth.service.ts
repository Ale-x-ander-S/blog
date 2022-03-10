import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResponse, User} from "../interfaces";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";




@Injectable({providedIn: "root"})
export class AuthService {

  public error$: Subject<string> = new Subject<string>()

    constructor(private http: HttpClient) {}

  get token():string {

    // @ts-ignore
    const expDate = new Date(localStorage.getItem('fb-token-exp'))
    if (new Date() > expDate) {
      this.logout()
      return  null as any
    }
      return localStorage.getItem('fb-token') as any
  }

  login(user: User): Observable<any> {
      user.returnSecureToken = true

    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
       .pipe(
         tap(AuthService.setToken),
         catchError(this.handleError.bind(this))
       )
  }

  logout() {
  AuthService.setToken(null)
  }

  isAuthenticated(): boolean{
    return !!this.token
  }

  private handleError (error: HttpErrorResponse): Observable<any>{
    const {message} = error.error.error
    switch (message) {
      case "EMAIL_NOT_FOUND":
        this.error$.next('Неверный email')
        break
      case "INVALID_EMAIL":
        this.error$.next('Такого email нет')
        break
      case "INVALID_PASSWORD":
        this.error$.next('Неверный пароль')
        break
    }
    return throwError(error)
  }

  private static setToken(response: FbAuthResponse | any) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }
  }
 }
