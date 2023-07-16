import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { SearchComponent } from './search/search.component';
import { GameComponent } from './game/game.component';
import { BodyComponent } from './body/body.component';
import { RatingsComponent } from './ratings/ratings.component';
import { RateGameComponent } from './rate_game/rate_game.component';
import { LoginComponent } from './login/login.component';
import { GameNewsComponent } from './game-news/game-news.component';
import { GameHighlightsComponent } from './game-highlights/game-highlights.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { AllGamesComponent } from './all-games/all-games.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { CartPopupComponent } from './cart-popup/cart-popup.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SocialComponent } from './social/social.component';
import { UtilizadorVisitadoComponent } from './utilizador-visitado/utilizador-visitado.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    WishlistComponent,
    ShoppingCartComponent,
    DashboardComponent,
    TopBarComponent,
    SearchComponent,
    CheckoutComponent,
    GameComponent,
    BodyComponent,
    RatingsComponent,
    RateGameComponent,
    GameNewsComponent,
    GameHighlightsComponent,
    LoginComponent,
    GameDetailsComponent,
    AllGamesComponent,
    FooterComponent,  
    RegisterComponent, 
    CartPopupComponent,
    ErrorPageComponent, 
    SocialComponent, 
    UtilizadorVisitadoComponent,  
  ],
  imports: [
    BrowserModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    BrowserAnimationsModule
  ],
  exports: [GameHighlightsComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
