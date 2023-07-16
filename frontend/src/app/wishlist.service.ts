import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Game, GameService } from './game.service';
import { Router } from '@angular/router';
import { Utilizador } from './utilizador';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private loggedUser= "";
  private usersUrl = 'http://appserver.alunos.di.fc.ul.pt:3061/utilizador';

  constructor(private http: HttpClient, private router: Router,private cookieService: CookieService,private gameService:GameService) {
    this.loggedUser=  this.cookieService.get('token');
   }


  async updateWishlist(user: Utilizador, game: Game) : Promise<void> {
 
    try {
      if (user.wishlist.some(wishGame => wishGame.toString() === game._id)) { //se inclui significa que é para remover
        await this.removeGameFromWishlist(game._id);
        alert(game.name + " removed successfully from wishlist");
      }
      else { // se nao inclui significa que é para passar a incluir - adicionar
        await this.addGameToWishlist(game._id);
        alert(game.name + " added successfully to wishlist");
      }
      this.router.navigate(['/wishlist/' + this.cookieService.get('token')]);
    } catch (error:any) {
      const errorMessage = error.error.message || 'An error occoured';
      alert(errorMessage);
    }
  }

  addGameToWishlist(gameId: string): Promise<void> {

   const url = `${this.usersUrl}/wishlistadd/${this.cookieService.get('token')}`;
   return this.http.post<any>(url,{gameId}).toPromise().catch(error => {
    const errorMessage = error.error.message || 'An error occoured adding the game to wishlist';
    alert(errorMessage);
    throw error;});
  }

  removeGameFromWishlist(gameId: string): Promise<void> {
    const url = `${this.usersUrl}/${this.cookieService.get('token')}/wishlist/remove/${gameId}`;  
    return this.http.delete<any>(url).toPromise().catch(error => {
      const errorMessage = error.error.message || 'An error occoured removing the game from wishlist';
      alert(errorMessage);
      throw error;});
  }
 

  getWishlistItems(userId:string): Observable<Game[]> {
      return this.http.get<Game[]>(`${this.usersUrl}/${userId}/wishlist/get`);  
  }
}