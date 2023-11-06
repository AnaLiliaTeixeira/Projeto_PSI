import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CartItem, CartService } from '../cart.service';
import { GameService } from '../game.service';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { Game } from '../game';
import { CookieService } from 'ngx-cookie-service';
import { Utilizador } from '../utilizador';
import { LoginService } from '../login.service';
import { HttpClient } from '@angular/common/http';
import {FollowersService} from '../followers.service';
import { NavigationEnd } from '@angular/router';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { LibraryService } from '../library.service';
import { Buy } from '../buy';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})

export class ShoppingCartComponent implements OnInit{
  @Input()
  cartItems: CartItem[] = [];
  total: number = 0;
  loggedInUser!: Utilizador;
  gameId: string = '';
  showGiftForm = false;
  userlist: Utilizador[] = [];
  user:Utilizador | undefined
  token: string = '';
  cartItemCount: number = 0;
  userBuys: any;
  selectedRecipientForGift!: string;
  selectedItemForGift!: CartItem;
  notificationMessage: string = '';
  showAlertMessage = false;

  constructor(private http : HttpClient, 
    private followersService: FollowersService, 
    private loginService: LoginService, 
    private cookieService: CookieService,
    private cartService: CartService,
    private gameService: GameService, 
    private router: Router,
    private libraryService: LibraryService,
    )
  { }

  getCookie(){
    return this.cookieService.get('login') === 'true';
  }
  ngOnInit(): void {
    this.loginService.getLoginUser(this.cookieService.get('token'))
      .subscribe(
        (user: Utilizador) => {
          this.loggedInUser = user;
          this.cartService.cartItemCount$.subscribe(count => {
            this.cartItemCount = count;
          });
  
          this.followersService.getUsers().subscribe((users: any[]) => {
            this.userlist = users.filter((user: { _id: string }) => user._id !== this.loggedInUser._id);
          });
  
          this.cartService.cartItems$.subscribe(cartItems => {
            const gameObservables = cartItems.map((item) => {
              return this.getGame(item.game);
            });
  
            forkJoin(gameObservables)
              .subscribe((response) => {
                console.log('Response:', response); // Checking the response from getGame
                const games = response as Game[];
  
                this.cartItems = cartItems.map((item: any, index: number) => {
                  console.log('Game at index:', games[index]); // Checking the game object at current index
                  const game = games[index];
                  return {
                    ...item,
                    ...this.getGameInfo(game)
                  };
                }); 
                this.calculateTotal();        
                console.log(this.total);
              });
          });
        },
        (error: any) => {
          console.error(error);
        }
      );
  }
  

  showGiftAlert(): void {
    this.notificationMessage = 'You have received a gift!';
  }

  getUrl(item:any): string {
    return item.gameImageUrl;
  }

  getPrice(item:any): number {
    return item.gamePrice;
  }

  getTotalItems(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  cartTooltip(): string {
    const games = this.cartItems.map(item => item.game.name).join(", ");
    return games || "No games in cart";
  }
  
  private getGame(game: any): Observable<Game> {
    return this.gameService.getGameById(game);
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((acc, item) => {
      const itemTotal = item.gamePrice ? item.gamePrice * item.quantity : 0;
      return acc + itemTotal;
    }, 0);  
  }
  
  
  private getGameInfo(game: Game) {
    return {
      gameTitle: game.name,
      gamePrice: game.price,
      gameImageUrl: game.images.main,
      gameId: game._id,
      gameType: game.game_type
    };
  }

  addQuantity(gameId: Game): void {
    const item = this.cartItems.find(item => item.game._id === gameId._id);
    if (item) {
      if (!item.isGift) { // Verifica se o item não está marcado como presente
        item.quantity += 1;
        this.cartService.addToCart(this.loggedInUser._id, gameId, 1);
      }
    }
    this.calculateTotal();
  }
  

  removeQuantity(gameId: Game): void {
    const itemIndex = this.cartItems.findIndex(item => item.game._id === gameId._id);
    if (itemIndex !== -1) {
      const item = this.cartItems[itemIndex];
      item.quantity = Math.max(0, item.quantity - 1);
      if (item.quantity === 0) {
        this.cartItems.splice(itemIndex, 1); // Remove o item do array
        this.cartService.removeFromCart(this.loggedInUser._id, gameId);
      }
    }
    this.calculateTotal();
  }
  
  getCartItemCount(): number {
    return this.cartItemCount;
  }

  getCartItem(item: any): number {
    return item.quantity;
  }

  getPriceTotal(): number {
    return this.total;
  }

  clearCart(): void {
    this.cartService.clearCart(this.loggedInUser._id);
    this.cartItems = [];
    this.total = 0;
  }

  getTotal(): number {
    return this.total;
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  closeModal(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.showGiftForm = false;
    }
  }
  
  cancelGiftSelection(): void {
    if (this.selectedItemForGift) {
        this.selectedItemForGift.isGift = false;
    }
  }

  isGameSelectedAsGift(game: CartItem): Promise<boolean> {
    const selectedCartItem = this.cartItems.find(item => item.gameId === game.gameId);
  
    if (!this.selectedRecipientForGift) {
      return Promise.resolve(false);
    }
    console.log('isGameSelectedAsGift', selectedCartItem);
    return this.http.get<Buy[]>(`http://localhost:3061/utilizador/${this.selectedRecipientForGift}/buys`).toPromise()
      .then(buys => {
        if (buys && buys.length > 0) {
          const hasGameInBuys = buys.some(buy => buy.game.toString() === game.gameId);
          return !hasGameInBuys && selectedCartItem?.gameId === game.gameId;
        } else {
          return selectedCartItem?.gameId === game.gameId;
        }
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }

  selectGift(item: CartItem): void {
    // Set the selected item for gift
    this.selectedItemForGift = item;
    console.log("selected", this.selectedItemForGift);
    item.isGift = false;
    this.showGiftForm = true;
  }

  showAlert() {
    this.showAlertMessage = true;
    setTimeout(() => {
      this.showAlertMessage = false;
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  async markAsGift(item: CartItem): Promise<void> {
    if (await this.isGameSelectedAsGift(item)) {
      item.quantity = 1;
      item.isGift = true;
      item.recipientId = this.selectedRecipientForGift;
      this.cartService.markAsGift(this.loggedInUser._id, item.game, item.recipientId);
    }else 
      this.showAlert();
    this.showGiftForm = false;
  }  
}