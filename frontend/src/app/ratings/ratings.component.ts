import { Component, Input, OnInit } from '@angular/core';
import { Rating } from '../rating';
import { Game } from '../game';
import { RatingService } from '../rating.service';
import { LoginService } from '../login.service';
import { CookieService } from 'ngx-cookie-service';
import { Opinion } from '../opinion';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent implements OnInit {
  @Input() game: Game | undefined;
  ratings: Rating[] = [];
  visibleRatings: Rating[] = [];
  showMore: boolean = false;

  showReply: boolean[] = [];
  replyText: string[] = [];
  

  constructor(private ratingService: RatingService,private cookieService: CookieService, private loginService: LoginService) { }

  ngOnInit(): void {
    if (this.game) {
      for (const ratingId of this.game.ratings) {
        this.ratingService.getRatingById(ratingId.toString()).subscribe(rating => {
          this.loginService.getLoginUser(rating.user.toString()).subscribe(user => {
            const ratingObj = {
              ...rating,
              user: user,
              opinion: [] as Opinion[],
            };
            for (const opinionId of rating.opinion) {
              this.ratingService.getOpinionById(opinionId.toString()).subscribe(opinion => {
                this.loginService.getLoginUser(opinion.user.toString()).subscribe(user => {
                  const opinionObj: Opinion = {
                    user: user,
                    _id: opinion._id,
                    message: opinion.message
                  };
                  ratingObj.opinion.push(opinionObj);
                });
              });
            }
            this.ratings.push(ratingObj);
            this.visibleRatings = this.ratings.slice(0, 3);
          });
        });
      }
    }
  }
  

  getStars(rating: number): string {
    const numStars = Math.round(rating);
    return '★'.repeat(numStars) + '☆'.repeat(5 - numStars);
  }


  likeRating(rating: Rating) {
    if (rating && rating._id) {
      rating.likes += 1;
      this.ratingService.updateRating(rating._id.toString(), rating).subscribe(updatedRating => {
        console.log(`Liked rating ${rating._id}`);
      });
    }
  }
  
  dislikeRating(rating: Rating) {
    if (rating && rating._id) {
      rating.dislikes += 1;
      this.ratingService.updateRating(rating._id.toString(), rating).subscribe(updatedRating => {
        console.log(`Disliked rating ${rating._id}`);
      });
    }
  }


  toggleReply(index: number) {
    this.showReply[index] = !this.showReply[index];
  }

   async submitReply(index: number) {
    const reply = this.replyText[index];
    const currentUser = await this.loginService.getLoginUser(this.cookieService.get('token')).toPromise();
    if (reply && currentUser) {
      const rating = this.visibleRatings[index];
      const opinion = {
        message: reply,
        user: currentUser
      };
      if(rating._id)
      this.ratingService.addOpinion(rating._id?.toString(), opinion).subscribe(updatedRating => {
        this.replyText[index] = '';
        this.showReply[index] = false;
        rating.opinion = updatedRating.opinion;
        setTimeout(() => {
          location.reload();
        }, 500);
      });
    }
  }
  

  showMoreRatings() {
    this.showMore = true;
    this.visibleRatings = [...this.ratings];
  }

  showLessRatings() {
    this.showMore = false;
    this.visibleRatings = this.ratings.slice(0, 3);
  }

  showLess() {
    this.visibleRatings = this.ratings.slice(0, 3);
  }

  get showMoreButtonVisible() {
    return !this.showMore && this.ratings.length > 3;
  }

  get showLessButtonVisible() {
    return this.showMore;
  }

}
