import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CartItem, CartService } from '../cart.service';
import { Game, GameService } from '../game.service';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'cart-popup',
  templateUrl: './cart-popup.component.html',
  styleUrls: ['./cart-popup.component.css'],
  animations: [
    trigger('cartAnimation', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden <=> visible', animate('0.3s ease-in-out')),
    ]),
  ],
})export class CartPopupComponent implements OnInit {
  @Input()
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {}

  goToCheckout(): void {
    this.router.navigate(['/shoppingcart']);
  }
}