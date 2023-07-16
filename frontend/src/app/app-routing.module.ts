import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { RateGameComponent } from './rate_game/rate_game.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { UserComponent } from './user/user.component';
import { AllGamesComponent } from './all-games/all-games.component';
import { SearchComponent } from './search/search.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { UtilizadorVisitadoComponent } from './utilizador-visitado/utilizador-visitado.component';
import { CheckoutComponent } from './checkout/checkout.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'regist', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'shoppingcart', component: ShoppingCartComponent },
  { path: 'game/:id', component: GameDetailsComponent },
  { path: 'game/:id/rating', component: RateGameComponent },
  { path: 'user', component: UserComponent },
  { path: 'all-games', component: AllGamesComponent },
  { path: 'search/:searchTerm', component: SearchComponent },
  { path: 'user/:id',component:UtilizadorVisitadoComponent },
  { path: 'wishlist/:id', component: WishlistComponent },
  { path: 'checkout', component: CheckoutComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
