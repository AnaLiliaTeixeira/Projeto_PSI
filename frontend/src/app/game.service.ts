import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { Game } from './game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gamesUrl = 'http://localhost:3061/games';
  private gameUrl = 'http://localhost:3061/game';

  private searchTerm: string = '';
  private wasBought: boolean = false;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  setSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  getSearchTerm(): string {
    return this.searchTerm;
  } 

  setWasBougth(wasBought: boolean) {
    this.wasBought = wasBought;
  }

  getWasBougth(): boolean {
    return this.wasBought;
  } 
  
  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.gamesUrl);
  }

  getGameById(id: string): Observable<Game> {
    const url = `${this.gameUrl}/${id}`;
    return this.http.get<Game>(url);
  }

  searchGamesByName(search : string): Observable<Game[]> {
    const url = `${this.gameUrl}?name=${search}`;
    return this.http.get<Game[]>(url);
  }

  updateGame(game: Game): Observable<Game> {
    const url = `${this.gameUrl}/${game._id}`;
    return this.http.put<Game>(url, game, this.httpOptions)
      .pipe(
        tap(_ => console.log(`updated game id=${game._id}`)),
        catchError(this.handleError<any>('updateGame'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}

export { Game };
