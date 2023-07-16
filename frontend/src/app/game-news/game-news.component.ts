import { Component, OnInit } from '@angular/core';
import { Game } from '../game';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { WishlistService } from '../wishlist.service';
import { LoginService } from '../login.service';
import { CookieService } from 'ngx-cookie-service';
import { Utilizador } from '../utilizador';


@Component({
  selector: 'app-game-news',
  templateUrl: './game-news.component.html',
  styleUrls: ['./game-news.component.css']
})
export class GameNewsComponent implements OnInit {
  
  jogos: Game[] | undefined;
  showWishlistMessage = false;
  gameName : string = '';
  message : string = '';
  user !: Utilizador;

  constructor(private gameService: GameService, 
    private cartsService: CartService, 
    private wishlistService: WishlistService,
    private router: Router,
    private cookieService: CookieService,
    private loginService: LoginService) 
    {
      this.loginService
      .getLoginUser(this.cookieService.get('token'))
      .subscribe((user) => {
        this.user = user;
      });
    }

  ngOnInit() {
    this.getGames();
  }

  getGames(): void {
    this.gameService.getGames()
      .subscribe((jogos: Game[] | undefined) => this.jogos = jogos);
  }

  verDetalhes(game:Game) {
    this.router.navigate(['/game', game._id]);
  }

  addToCart(game: Game) {
    this.cartsService.addToCart(this.user._id,game._id, 1);
  }

  updateWishlist(game: Game) {
    this.wishlistService.updateWishlist(this.user, game);
  }
}
