import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Utilizador } from './utilizador';

@Injectable({
  providedIn: 'root'
})
export class FollowersService {
  private usersUrl = 'http://appserver.alunos.di.fc.ul.pt:3061/utilizador';
  private usersUrl_ = 'http://appserver.alunos.di.fc.ul.pt:3061/utilizadorId';
  
  constructor(private http: HttpClient) { }

  getUsers(): Observable<Utilizador[]> {
    const url = 'http://appserver.alunos.di.fc.ul.pt:3061/utilizadores';
    return this.http.get<Utilizador[]>(url);
  }
  
  followUser(loggedUserId: String, userId: String): Observable<Utilizador> {
    const url = `${this.usersUrl}/${loggedUserId}/following/${userId}`;
    return this.http.post<Utilizador>(url, {});
  }

  unfollowUser(loggedUserId: String, userId: String): Observable<Utilizador> {
    const url = `${this.usersUrl}/${loggedUserId}/following/${userId}`;
    return this.http.delete<Utilizador>(url);
  }

  getFollowingList(userId: String): Observable<any[]> {
    const url = `${this.usersUrl}/${userId}/following`;
    return this.http.get<any[]>(url);
  }

  getFollowersList(userId: string): Observable<Utilizador[]> {
    const url = `${this.usersUrl}/${userId}/followers`;
    return this.http.get<Utilizador[]>(url);
  }

  getUser(userId: String): Observable<Utilizador> {
    const url = `${this.usersUrl}/${userId}`;
    return this.http.get<Utilizador>(url);
  }

  updateUsername(userId: string, newUsername: string): Observable<any> {
    const url = `${this.usersUrl}/${userId}/username`;
    const data = { username: newUsername };
    return this.http.put<any>(url, data);
  }

  updateProfileImage(userId: string, newImageUrl: string): Observable<any> {
    const url = `${this.usersUrl}/${userId}/imageProfile`;
    const data = { imageProfile: newImageUrl };
    return this.http.put<any>(url, data);
  }


  
  // getFollowersList(userId: String): Observable<any[]> {
  //   const url = `${this.usersUrl}/${userId}/followers`;
  //   return this.http.get<any[]>(url);
  // }

}
