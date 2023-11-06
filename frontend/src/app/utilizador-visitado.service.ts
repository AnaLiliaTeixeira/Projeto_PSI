import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Utilizador } from './utilizador';

@Injectable({
  providedIn: 'root'
})
export class UtilizadorVisitadoService {

  constructor(private http: HttpClient ,private cookieService: CookieService ){}

  getUser(token: string): Observable<Utilizador> {
    const url = `${'http://localhost:3061/utilizadorId'}/${token}`;
    return this.http.get<Utilizador>(url);
  }
}
