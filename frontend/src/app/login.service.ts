import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Utilizador } from './utilizador';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private login = false;
  private token: string;
  private loginUrl = 'http://appserver.alunos.di.fc.ul.pt:3061/utilizador';
  loginStatusChanged = new EventEmitter<boolean>();
  logoutEvent = new EventEmitter<void>(); // Evento de logout

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.token = '';
  }

  async loginToken(name: string, password: string): Promise<boolean> {
    const url = `${this.loginUrl}/${name}/${password}`;
    const user = await this.http.get<any>(url).toPromise();

    if (user) {
      this.cookieService.set('login', 'true');
      this.cookieService.set('token', user._id);
      this.emitLoginStatusChanged(true); // Emitir evento de login bem-sucedido
      return true;
    }

    return false;
  }

  public emitLoginStatusChanged(loggedIn: boolean): void {
    this.loginStatusChanged.emit(loggedIn);
  }

  getLoginUser(token: string): Observable<Utilizador> {
    const url = `${'http://appserver.alunos.di.fc.ul.pt:3061/utilizador'}/${token}`;
    return this.http.get<Utilizador>(url);
  }

  pesquisarUsuarios(name: String): Observable<Utilizador[]> {
    const url = `${'http://appserver.alunos.di.fc.ul.pt:3061/search'}/${name}`;
    return this.http.get<Utilizador[]>(url);
  }

  logout(): void {
    this.cookieService.set('login', 'false');
    this.cookieService.set('token', '');
    this.emitLoginStatusChanged(false); // Emitir evento de logout
    this.logoutEvent.emit(); // Emitir evento de logout personalizado
  }
}
