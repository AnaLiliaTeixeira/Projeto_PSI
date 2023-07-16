import { Component, Input } from '@angular/core';
import { Game } from '../game';
import { RatingService } from '../rating.service';
import { Rating } from '../rating';
import { GameService } from '../game.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../login.service';
import { Utilizador } from '../utilizador';

@Component({
  selector: 'app-rate_game',
  templateUrl: './rate_game.component.html',
  styleUrls: ['./rate_game.component.css']
})
export class RateGameComponent {
  @Input() game: Game | undefined;
  rating: number = 0;
  review: string = '';
  user: Utilizador | undefined;

  constructor(private ratingService: RatingService, private gameService: GameService, private cookieService: CookieService, private loginService:LoginService){ }

  onStarClick(rating: number) {
    this.rating = rating;
  }

  onReviewChange(event: Event) {
    if (event && event.target) {
      this.review = (event.target as HTMLTextAreaElement).value;
    }
  }
  

  onSubmit() {
    if (this.rating === 0) {
      return;
    }
  
    this.loginService.getLoginUser(this.cookieService.get('token')).subscribe((user) => {
      this.user = user;
  
      if (this.game && this.game._id && this.user) {
        const newRating: Rating = { rank: this.rating, message: this.review ,likes:0,dislikes:0, opinion:[],user:this.user};
        this.ratingService.addRating(this.game._id.toString(), newRating).subscribe(updatedGame => {
          this.gameService.getGameById(updatedGame._id).subscribe(game => {
            this.game = game;
            setTimeout(() => {
              location.reload();
            }, 200);
          });
        });
      }
    });
  }
}
  
  
  
  
  
  
  
    

