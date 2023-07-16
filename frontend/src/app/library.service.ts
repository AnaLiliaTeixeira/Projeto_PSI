import { Injectable } from '@angular/core';
import { Game } from './game'
import { CartItem } from './cart.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import {Buy} from './buy'
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private games: Game[] = [];

  constructor(private cookieService: CookieService,private http: HttpClient,private gameService: GameService) { }

  async addGamesToLibrary(items: CartItem[]) {
    const userId = this.cookieService.get("token");
    
    for (const item of items) {
      const game: Game = {
        _id: item.game._id,
        name: item.game.name,
        game_type: item.game.game_type,
        price: item.game.price,
        avarageRating: item.game.avarageRating,
        ratings: item.game.ratings,
        description: item.game.description,
        images: item.game.images,
        platform: item.game.platform,
        idioms: item.game.idioms,
        
      };
      for (let i = 0; i < item.quantity; i++) {
        await this.http.post(`http://appserver.alunos.di.fc.ul.pt:3061/utilizador/${userId}/game`, { game: item.game }).toPromise();
      }
    }
  }

  getUserBuys(): Observable<Buy[]> {
    const userId = this.cookieService.get('token');
    return this.http
      .get<Buy[]>(`http://appserver.alunos.di.fc.ul.pt:3061/utilizador/${userId}/buys`)
      .pipe(
        switchMap((buys) => {
          const gameObservables: Observable<Game>[] = [];
          for (const buy of buys) {
            gameObservables.push(
              this.gameService.getGameById(buy.game.toString())
            );
          }
          return forkJoin(gameObservables).pipe(
            map((games) =>
              buys.map((buy, index) => ({
                _id: buy._id,
                game: games[index],
                date: buy.date,
              }))
            )
          );
        })
      );
  }

  getLibrary(): Game[] {
    return this.games;
  }
}