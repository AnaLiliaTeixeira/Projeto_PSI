import { Injectable } from '@angular/core';
import { Game } from './game';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { Utilizador } from './utilizador';
import { LibraryService } from './library.service';


export interface CartItem {
  recipientId: string;
  game: Game;
  gameType: string;
  quantity: number;
  gameTitle?: string;
  gamePrice?: number;
  gameImageUrl?: string;
  isGift: boolean;
  gameId: string;
  selectedGift: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private KEY = 'cartItems';
  private timeoutDuration = 1 * 60 * 1000;
  user: Utilizador | null | undefined;
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable(); // make it observable
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private updatingCartForUser = new BehaviorSubject<boolean>(false);
  private isLoggedIn = false;  

  startTimeout(): void {
    setTimeout(() => {
      if (this.user && this.user._id) {
        this.clearCart(this.user._id);
      }
          }, this.timeoutDuration);
  }

  constructor(
    private http: HttpClient,
    private libraryService: LibraryService,
    private loginService: LoginService,
    private cookieService: CookieService,
  ){
    this.loginService.loginStatusChanged.subscribe(loggedIn => {
      if (loggedIn) {
        const token = this.cookieService.get('token');
        if (token) {
          this.loginService.getLoginUser(token).subscribe(user => {
            if (user) {
              this.user = user;
              this.updateCartForUser(user);
            }
          });
        }
      } else {
        this.logout();
      }
    });
  
    const token = this.cookieService.get('token');
    if (token) {
      this.loginService.getLoginUser(token).subscribe(user => {
        if (user) {
          this.user = user;
          this.updateCartForUser(user);
        }
      });
    }
  
    this.loginService.loginStatusChanged.subscribe(loggedIn => {
      this.user = loggedIn ? this.user : null;
      this.updateLoginStatus(loggedIn);
      if (loggedIn && this.user) {
        this.updateCartForUser(this.user);
      }
    });
    
    this.loginService.logoutEvent.subscribe(() => {
      if (!this.isLoggedIn && this.user) {
        this.updateCartForUser(this.user);
      }
    });
  }

  getTotalPrice(user: String): Observable<number> {
    return this.getCartItems(user).pipe(
      map(items => items.reduce((total, item) => total + item.game.price * item.quantity, 0))
    );
  }

  public updateLoginStatus(loggedIn: boolean): void {
    this.isLoggedIn = loggedIn;
    if (!loggedIn) {
      this.logout();
    }
  }

  getTotalItemCount(userId: String): Observable<number> {
    return this.getCartItems(userId).pipe(
      map((items: CartItem[]) => {
        console.log(items);
        return items.reduce((acc, item) => acc + item.quantity, 0);
      })
    );
  }

  resetCartItemCount(): void {
    this.cartItemCount = new BehaviorSubject<number>(0);
    this.cartItemCount$ = this.cartItemCount.asObservable();
  }  

  markAsGift(userId: string, gameId: Game, recipientId: string): void {
    const item = this.cartItemsSubject.value.find(
      (item) => item.game === gameId
    );

    if (item) {
      item.isGift = true;
      item.recipientId = recipientId;
      item.quantity = 1; // Definir a quantidade como 1

      // Atualizar o item no banco de dados
      const url = `http://appserver.alunos.di.fc.ul.pt:3061/update-cart-item/${userId}/${gameId}`;
      const payload = {
        isGift: item.isGift,
        recipientId: item.recipientId,
        quantity: item.quantity // Incluir a nova quantidade no payload
      };

      this.http.patch(url, payload).subscribe(
        (response) => {
          console.log(response);
          // Atualizar o BehaviorSubject cartItemsSubject com os itens atualizados
          const cartItems = this.cartItemsSubject.value.map((cartItem) => {
          if (cartItem.game === gameId) {
            return item; // Substituir o item antigo pelo item atualizado
          }
            return cartItem;
          });
          this.cartItemsSubject.next(cartItems);
        },
        (error) => {
          console.log(error);
        }
      );
    }

    console.log(item);
  }

  async sendGifts(gifts: CartItem[]): Promise<void> {
    for (const gift of gifts) {
      const { gameId, recipientId } = gift;
  
      const game: Game = {
        _id: gift.game._id,
        name: gift.game.name,
        game_type: gift.game.game_type,
        price: gift.game.price,
        avarageRating: gift.game.avarageRating,
        ratings: gift.game.ratings,
        description: gift.game.description,
        images: gift.game.images,
        platform: gift.game.platform,
        idioms: gift.game.idioms,
      };
  
      try {
        await this.http.post(`http://appserver.alunos.di.fc.ul.pt:3061/utilizador/${recipientId}/game`, { game: gift.game }).toPromise();
  
        const messageId = '...'; // Provide the messageId value
        
        if (this.user && this.user._id) {
          const notification = {
            message: `You got a gift from the user: ${this.user.name}!`,
            messageId: messageId // Include the messageId in the notification
          };
          await this.http.post(`http://appserver.alunos.di.fc.ul.pt:3061/utilizadorAddNotification/${recipientId}`, notification).toPromise();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  
  getCartItems(userId: String): Observable<CartItem[]> {
    const url = `http://appserver.alunos.di.fc.ul.pt:3061/cart/${userId}`;
    return this.http.get<CartItem[]>(url);
  }

  updateCartForUser(user: Utilizador): void {
    const userId = user._id;
  
    this.getTotalItemCount(userId).subscribe(count => {
      console.log('Updated cart count for user: ', count); // debug log
      this.cartItemCount.next(count);
  
      this.getCartItems(userId).subscribe(items => {
        console.log('Received cart items: ', items); // debug log
        this.cartItemsSubject.next(items);
      });
    });
  }
  
  
  
  addToCart(userId: String, gameId: any, quantity: number): void {
    const url = `http://appserver.alunos.di.fc.ul.pt:3061/update-cart/${userId}`;
    const payload = { gameId, quantity };
  
    this.http.post(url, payload).subscribe(
      response => {
        console.log(response);
        this.getTotalItemCount(userId).subscribe(count => {
          console.log('Updated cart count after adding to cart: ', count); // Add debug log
          this.cartItemCount.next(count);
        });
        // Update the cart items
        this.getCartItems(userId).subscribe(items => {
          this.cartItemsSubject.next(items);
        });
      },
      error => console.log(error)
    );
  }
  
  removeFromCart(userId: String, gameId: any): void {
    const url = `http://appserver.alunos.di.fc.ul.pt:3061/remove-from-cart/${userId}/${gameId}`;
  
    this.http.delete(url).subscribe(
      response => {
        console.log(response);
        this.getTotalItemCount(userId).subscribe(count => {
          console.log('Updated cart count after removing from cart: ', count); // Add debug log
          this.cartItemCount.next(count);
        });
        // Update the cart items
        this.getCartItems(userId).subscribe(items => {
          this.cartItemsSubject.next(items);
        });
      },
      error => console.log(error)
    );
  }
  
  clearCart(userId: string): void {
    const url = `http://appserver.alunos.di.fc.ul.pt:3061/clear-cart/${userId}`;
  
    this.http.delete(url).subscribe(
      response => {
        console.log(response);
        this.getTotalItemCount(userId).subscribe(count => {
          console.log('Updated cart count after clearing cart: ', count); // Add debug log
          this.cartItemCount.next(count);
        });
      },
      error => console.log(error)
    );
  }

  logout(): void {
    this.user = null;
    this.cartItemsSubject.next([]);
    this.resetCartItemCount();
  }
}
