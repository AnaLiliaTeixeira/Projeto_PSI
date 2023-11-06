import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rating } from './rating';
import { Observable } from 'rxjs';
import { Game } from './game';
import { Opinion } from './opinion';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) { }

  addRating(gameId: String, rating: Rating): Observable<Game> {
    return this.http.post<Game>(`http://localhost:3061/game/${gameId}/rating`, rating);
  }

  addOpinion(ratingId: String, opinion: Opinion): Observable<Rating> {
    return this.http.post<Rating>(`http://localhost:3061/rating/${ratingId}/opinion`, opinion);
  }

  getRatingById(ratingId: String): Observable<Rating> {
    return this.http.get<Rating>(`http://localhost:3061/rating/${ratingId}`);
  }

  getOpinionById(opinionId: String): Observable<Opinion> {
    return this.http.get<Opinion>(`http://localhost:3061/opinion/${opinionId}`);
  }

  updateRating(ratingId: string, rating: Rating): Observable<Rating> {
    return this.http.put<Rating>(`http://localhost:3061/rating/${ratingId}`, rating);
  }
}
