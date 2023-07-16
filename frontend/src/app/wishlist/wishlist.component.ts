
import { ANALYZE_FOR_ENTRY_COMPONENTS, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../cart.service';
import { Game } from '../game.service';
import { LoginService } from '../login.service';
import { Utilizador } from '../utilizador';
import { WishlistService } from '../wishlist.service';
import { GameService } from '../game.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  user: Utilizador | undefined;
  games: Game[] = [];

  message: string = '';
  current_game: string = '';
  showMessage = false;
  addedToCart: Game[] = [];

  constructor(
    private gameService: GameService,
    private wishlistService: WishlistService,
    private cartsService: CartService,
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.showMessage = false;
  }
  getGamesSize(): boolean {
    return ((this.games.length) > 0);
  }

  ngOnInit() {
    this.loginService.getLoginUser(this.cookieService.get('token')).subscribe(
      (u) => {
        this.user = u;
        console.log("User on wishlist: " + u.name);
        this.getWishlistItems();
      }
    );
  }

  getCookie(): boolean {
    return this.cookieService.get('login') === 'true';
  }

  getWishlistItems(): void {
    if (this.user) {
      this.wishlistService.getWishlistItems(this.user._id).subscribe(
        (games2: Game[]) => {
          console.log(games2);
          this.games = games2;
          if (this.games.length > 0) {
            console.log(this.games[0]._id);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }


  async removeGameFromWishlist(game: Game): Promise<void> {
    try {
      await this.wishlistService.removeGameFromWishlist(game._id);
      alert(game.name + " removed successfully from wishlist");
      this.getWishlistItems();
    } catch(error:any) {
      const errorMessage = error.error.message || 'An error occoured removing the game from wishlist';
      alert(errorMessage);
    }
  }

  watchDetails(game: Game): void {
    this.router.navigate(['/game', game._id]);
  }
}


