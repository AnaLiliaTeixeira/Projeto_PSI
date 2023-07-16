import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CartPopupComponent } from '../cart-popup/cart-popup.component';
import { CartItem, CartService } from '../cart.service';
import { GameService } from '../game.service';
import { LoginService } from '../login.service';
import { CookieService } from 'ngx-cookie-service';
import { Utilizador } from '../utilizador';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  loggedUser = "";
  user!: Utilizador;
  searchTerm: string = '';
  isCartPopupOpen: boolean = false;
  cartItems: CartItem[] = [];
  isDropdownOpen: boolean = false;
  cartItemCount!: number;
  showMessage = false;

  constructor(
    public cartService: CartService,
    private cookieService: CookieService,
    private gameService: GameService,
    private loginService: LoginService,
    private router: Router,
    public dialog: MatDialog
  ) {

    this.loginService
      .getLoginUser(this.cookieService.get('token'))
      .subscribe((user) => {
        this.loggedUser = user._id;
        this.user = user;
        this.cartService
          .getCartItems(this.user._id)
          .subscribe((cartItems) => {
            this.cartItems = cartItems;
          });
      });
  }
  ngOnInit(): void {
    this.setShowMessage(false);
    this.cartService.cartItemCount$.subscribe(count => {
      console.log('Received cart item count: ', count); // Adicione este log
      this.cartItemCount = count;
    });
    
  }

  setShowMessage(b: boolean) {
    this.showMessage = b;
  }

  getCartItemCount(): number {
    return this.cartItemCount;
  }

  redirect(searchTerm: string) {
    console.log("BOAS")
    if (searchTerm.length == 0 || searchTerm.startsWith(' ')) {
      alert("Fill this field");
    }
    else {
      this.searchTerm = searchTerm;
      this.cookieService.set("search",this.searchTerm)
      const pageUrl = window.location.href;
      const pageSplited = pageUrl.split("/");
      const id = pageSplited[pageSplited.length - 2];
      if(id === "search"){
        location.reload();
      }
      else{
        this.router.navigate(['search/', this.searchTerm]);
      }
      
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/']);
    console.log("adeus...");
  }

}
