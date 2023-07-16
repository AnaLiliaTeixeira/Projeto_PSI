import { Component, OnInit } from '@angular/core';
import { Game } from '../game';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { CookieService } from 'ngx-cookie-service';
import { WishlistService } from '../wishlist.service';
import { LoginService } from '../login.service';
import { Utilizador } from '../utilizador';

@Component({
  selector: 'app-all-games',
  templateUrl: './all-games.component.html',
  styleUrls: ['./all-games.component.css']
})
export class AllGamesComponent implements OnInit {

  jogos: Game[] | undefined;
  user!: Utilizador;

  constructor( private gameService: GameService, 
    private cartsService: CartService, 
    private wishlistService: WishlistService,
    private router: Router,
    private cookieService: CookieService,
    private loginService: LoginService
  ) {
    this.loginService
    .getLoginUser(this.cookieService.get('token'))
    .subscribe((user) => {
      this.user = user;
    });
    
   }

  getCookie(){
    return this.cookieService.get('login') === 'true';
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
    this.cartsService.addToCart(this.user._id, game, 1);
  }

  updateWishlist(game: Game) {
    this.wishlistService.updateWishlist(this.user, game);
  }
}