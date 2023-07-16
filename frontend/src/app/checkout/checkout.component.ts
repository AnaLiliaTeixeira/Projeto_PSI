import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { LibraryService } from '../library.service';
import { WishlistService } from '../wishlist.service';
import { CookieService } from 'ngx-cookie-service';
import { Utilizador } from '../utilizador';
import { LoginService } from '../login.service';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { forkJoin, of, Subject } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  userNIF: string = '';
  userAddress: string = '';
  paymentMethods: string[] = ['Credit Card', 'PayPal'];
  selectedMethod: string = '';
  paymentSuccess: boolean = false;
  paymentError: boolean = false;
  errorMessage: string = '';
  nifError: boolean = false;
  user!: Utilizador;
  cartTotal: number = 0;
  showAlertMessage = false;
  notificationMessage!: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public cartService: CartService,
    private libraryService: LibraryService,
    private router: Router,
    private wishlistService: WishlistService,
    private cookieService: CookieService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.loginService
      .getLoginUser(this.cookieService.get('token'))
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((user) => {
          this.user = user;
          this.cartService.getTotalPrice(this.user._id).subscribe((total) => {
            this.cartTotal = total;
          });
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showGiftAlert(): void {
    this.notificationMessage = 'You have sent a gift!';
  }

  showAlert() {
    this.showAlertMessage = true;
    setTimeout(() => {
      this.showAlertMessage = false;
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  getCookie() {
    return this.cookieService.get('login') === 'true';
  }

  getTotal(): number {
    return this.cartTotal;
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(form: NgForm) {
    this.nifError = false;

    if (!form.valid) {
      if (form.controls['nif'].invalid) {
        this.nifError = true;
      }
      return;
    }

    this.userNIF = form.value.nif;
    this.userAddress = form.value.address;

    if (!this.selectedMethod) {
      this.paymentError = true;
      return;
    }

    switch (this.selectedMethod) {
      case 'Credit Card':
        const paymentResult1 = Math.random() < 0.5;
        console.log(paymentResult1);
        if (paymentResult1) {
          this.cartService
            .getCartItems(this.user._id)
            .pipe(
              switchMap((items) => {
                console.log(items);
                // dividir os itens em presentes e não presentes
                const gifts = items.filter((item) => item.isGift);
                const nonGifts = items.filter((item) => !item.isGift);

                if (gifts.length > 0) {
                  this.cartService.sendGifts(gifts);
                  this.showAlertMessage = true;
                }

                if (nonGifts.length > 0) {
                  this.libraryService.addGamesToLibrary(nonGifts);
                }

                return of([gifts, nonGifts]);
              }),
              tap(() => {
                this.cartService.clearCart(this.user._id);
                this.paymentSuccess = true;
                if (this.showAlertMessage) {
                  this.showAlert();
                }
              })
            )
            .subscribe();
        } else {
          this.paymentError = true;
          this.errorMessage = 'Payment failed. Please try again.';
        }

        break;
      case 'PayPal':
        const paymentResult2 = Math.random() < 0.5;
        if (paymentResult2) {
          this.cartService
            .getCartItems(this.user._id)
            .pipe(
              switchMap((items) => {
                console.log(items);
                // dividir os itens em presentes e não presentes
                const gifts = items.filter((item) => item.isGift);
                const nonGifts = items.filter((item) => !item.isGift);

                if (gifts.length > 0) {
                  this.cartService.sendGifts(gifts);
                  this.showAlertMessage = true;
                }

                if (nonGifts.length > 0) {
                  this.libraryService.addGamesToLibrary(nonGifts);
                }

                return of([gifts, nonGifts]);
              }),
              tap(() => {
                this.cartService.clearCart(this.user._id);
                this.paymentSuccess = true;
                if (this.showAlertMessage) {
                  this.showGiftAlert();
                }
              })
            )
            .subscribe();
        } else {
          this.paymentError = true;
          this.errorMessage = 'Payment failed. Please try again.';
        }
        break;
    }
  }
}
