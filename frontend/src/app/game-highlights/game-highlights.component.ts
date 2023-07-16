import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Game } from '../game';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-highlights',
  templateUrl: './game-highlights.component.html',
  styleUrls: ['./game-highlights.component.css'],
  providers: [],
  encapsulation: ViewEncapsulation.None
})
export class GameHighlightsComponent implements OnInit {

  jogos: Game[] = [];
  slideIndex = 1;
  slidesToShow = 5;

  constructor(private gameService: GameService, private router: Router) { }

  ngOnInit() {
    this.getGames();
  }

  getGames(): void {
    this.gameService.getGames()
      .subscribe((jogos: Game[]) => {
        this.jogos = jogos;
        if (jogos.length > 0) {
          this.showSlides(this.slideIndex);
        }
      });
  }

  getSlides(): number[] {
    return Array(Math.ceil(this.jogos.length / this.slidesToShow)).fill(0).map((x, i) => i + 1);
  }

  getJogos(slide: number): Game[] {
    return this.jogos.slice((slide - 1) * this.slidesToShow, slide * this.slidesToShow);
  }

  verDetalhes(game: Game) {
    this.router.navigate(['/game', game._id]);
  }

  plusSlides(n: number) {
    this.slideIndex += n;
    const numSlides = Math.ceil(this.jogos.length / this.slidesToShow);
    if (this.slideIndex > numSlides) {
      this.slideIndex = 1;
    } else if (this.slideIndex < 1) {
      this.slideIndex = numSlides;
    }
  }

  showSlides(n: number) {
    this.slideIndex = n;
  }

  get numSlides() {
    return Math.ceil(this.jogos.length / this.slidesToShow);
  }

  verTodosJogos() {
    this.router.navigate(['/all-games']);
  }
}
