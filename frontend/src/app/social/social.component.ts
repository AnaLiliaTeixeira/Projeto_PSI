import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  Utilizador
} from '../utilizador';
import {
  LoginService
} from '../login.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent {
  menuAberto = false;
  results: Utilizador[] | undefined;
  @ViewChild('searchBox') searchBox: ElementRef | undefined;

  constructor(private loginService: LoginService,private router: Router, private cookieService: CookieService) {}

  toggleMenu() {
    if (this.searchBox) {
      this.searchBox.nativeElement.value = '';
      this.searchBox.nativeElement.focus();
    }
    this.menuAberto = !this.menuAberto;
  }

  pesquisar(): void {
    const nome = this.searchBox?.nativeElement.value;
    if (nome.trim().length > 0) {
      this.loginService.pesquisarUsuarios(nome).subscribe((resultados: Utilizador[]) => {
        this.loginService.getLoginUser(this.cookieService.get('token')).subscribe((user) => {
        this.results = resultados;
        for(const result of this.results){
            if(result.name == user.name){
            const index = this.results.indexOf(result);
            this.results.splice(index, 1);
          }
        }
        console.log(resultados);
      });
      });
    } else {
      this.results = [];
    }
  }
  watchDetails(usuario: Utilizador) {
    this.router.navigate(['/user', usuario._id]);
  }
}
