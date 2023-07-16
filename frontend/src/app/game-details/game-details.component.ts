import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { Game } from '../game';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { WishlistService } from '../wishlist.service';
import { LoginService } from '../login.service';
import { Utilizador } from '../utilizador';
@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  game: Game | undefined;
  appearRatings_var: boolean = false;
  num_items_on_cart : number = 1;
  isOnWishlist : boolean = false;
  user!: Utilizador;
  
  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private cartsService: CartService,
    private cookieService: CookieService,
    private wishlistService: WishlistService,
    private router: Router,
    private loginService: LoginService,
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
  ngOnInit(): void {
    this.getGame();
    this.appearGameDetails();
  }

  appearGameDetails(): void {
    this.appearRatings_var = false;
    const d = document.getElementById('details');
    if (d != null) {
      d.style.borderBottomColor = "rgb(237, 165, 70)";
      d.style.color = "rgb(237, 165, 70)";
    }
    const r = document.getElementById('ratings');
    if (r != null) {
      r.style.borderBottomColor = "black";
      r.style.color = "black";
    }
  }
  
  appearRatings(): void {
    this.appearRatings_var = true;
    const r = document.getElementById('ratings');
    if (r != null) {
      r.style.borderBottomColor = "rgb(237, 165, 70)";
      r.style.color = "rgb(237, 165, 70)";
    }
    const d = document.getElementById('details');
    if (d != null) {
      d.style.borderBottomColor = "black";
      d.style.color = "black";
    }
  }

  getGame(): void {
    const _id = this.route.snapshot.paramMap.get('id');
    if (_id) {
      this.gameService.getGameById(_id)
        .subscribe(response => {
          this.game = response;
        });
    }
  }  

  addToCart(game: Game, quantity: number) {
    this.cartsService.addToCart(this.user?._id , game._id, quantity);
  }

  updateItemsCart(quantity:number):void{
    if (this.num_items_on_cart + quantity >= 0) {
      this.num_items_on_cart+= quantity;
    }
  }

  goToWishlist() {
      this.router.navigate(['/wishlist']);
  }

  updateQuantity(gameId: string): void {
    this.cartsService.addToCart(this.user._id, gameId, 1);
  }
  

  updateWishlist(game: Game) {
    this.wishlistService.updateWishlist(this.user, game);
  }
}
