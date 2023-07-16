import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, switchMap, tap, throwError } from 'rxjs';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { Utilizador } from './utilizador';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  user!: Utilizador;
  private _notifications: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private cookieService: CookieService,
  ) {
    this.loginService
      .getLoginUser(this.cookieService.get('token'))
      .subscribe((user) => {
        this.user = user;
        this.updateNotifications(this.user._id).subscribe();
      });
  }

  removeNotification(userId: string, notificationId: string): Observable<any> {
    return this.http.delete(`http://appserver.alunos.di.fc.ul.pt:3061/utilizadorDeleteNotification/${userId}/${notificationId}`).pipe(
      switchMap(() => this.updateNotifications(userId)),
      catchError((error) => {
        console.error(error);
        return throwError('Error removing notification.');
      })
    );
  }

  pollUserNotifications(userId: string): Observable<any[]> {
    return interval(5000).pipe( // 5000ms = 5 seconds
        startWith(0), // So that it emits immediately on subscription
        switchMap(() => this.getUserNotifications(userId))
    );
  }

  private updateNotifications(userId: string): Observable<any> {
    return this.getUserNotifications(userId).pipe(
      tap((notifications) => {
        this._notifications.next(notifications);
      }),
      catchError((error) => {
        console.error(error);
        return throwError('Error updating notifications.');
      })
    );
  }

  getUserNotifications(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://appserver.alunos.di.fc.ul.pt:3061/utilizadorGetNotifications/${userId}`);
  }
  
}