import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResgistarService {

  private loginUrl = 'http://appserver.alunos.di.fc.ul.pt:3061/utilizador';
  private loginUrl2 = 'http://appserver.alunos.di.fc.ul.pt:3061/utilizadores';
  constructor(private http: HttpClient  ){
  }

  async regist(name: string, password: string): Promise<boolean> {
    const url = `${this.loginUrl2}/${name}`;
    const user = await this.http.get<any>(url).toPromise();
    if (user === null) {
      await this.http.post<any>(this.loginUrl, { name, password}).toPromise();
      return true;
    }
    return false;
  }
  
}
