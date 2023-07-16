import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { LoginService } from '../login.service';
import { Utilizador } from '../utilizador';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  notifications$!: Observable<any[]>;
  loggedInUser!: Utilizador;
  showAlertMessage: boolean = false;
  messageAlert: string = '';

  constructor(
    private cookieService: CookieService,
    private notificationService: NotificationService,
    private loginService: LoginService
  ) {}

  getCookie(): boolean {
    return this.cookieService.get('login') === 'true';
  }

  ngOnInit(): void {
    if (this.getCookie()) {
      this.loginService.getLoginUser(this.cookieService.get('token')).subscribe((user) => {
        this.loggedInUser = user;
        console.log(this.loggedInUser);

        this.notifications$ = this.notificationService.pollUserNotifications(this.loggedInUser._id);

        this.notifications$.subscribe((notifications) => {
          if (notifications && Array.isArray(notifications)) {
            notifications.forEach((notification) => {
              this.showAlert(notification.message);
            });
          } else {
            console.error('Notifications is not an array');
          }
        });
      });
    }
  }

  removeNotification(userId: string, notificationId: string): void {
    this.notificationService.removeNotification(userId, notificationId).subscribe(
      () => {
        console.log('Notification removed successfully.');
        this.showAlert('Notification removed successfully.');
        this.showAlertMessage = false;
        // Atualize a lista de notificações após a remoção
        this.notifications$ = this.notificationService.pollUserNotifications(this.loggedInUser._id);
      },
      (error) => {
        console.error('Error removing notification:', error);
        this.showAlert('Error removing notification.');
        this.showAlertMessage = false;
      }
    );
  }

  showAlert(message: string): void {
    this.showAlertMessage = true;
    this.messageAlert = message;
  }
}
