import { Component } from '@angular/core';
import { Game } from '../game';
import { GameService } from '../game.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-purchased-items',
  templateUrl: './purchased-items.component.html',
  styleUrls: ['./purchased-items.component.css']
})
export class PurchasedItemsComponent {
  purchasedGames : Game [] = [];
  constructor(private cookieService: CookieService) {}

  getCookie(){
    return this.cookieService.get('login') === 'true';
  }
  
}


