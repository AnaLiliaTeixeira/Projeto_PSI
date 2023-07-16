import {
  Component
} from '@angular/core';
import {
  ResgistarService
} from '../resgistar.service';
import {
  LoginService
} from '../login.service';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  passwordCheck = '';

  constructor(private registarService: ResgistarService, private loginService: LoginService, private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async tryRegist() {

    this.username = this.username.trim();
    this.password = this.password.trim();
    this.passwordCheck = this.passwordCheck.trim();
    var error = false;
    if (this.password == this.passwordCheck) {
      //"^[a-zA-Z0-9]*$" is from https://www.techiedelight.com/check-string-contains-alphanumeric-characters-java/
      if (this.username.length < 3) {
        const li = document.getElementById('userMin');
        if (li) {
          li.className = "fa fa-times";
          error = true;
          const p = document.getElementById('message');

          if (p) {

            p.textContent = ("Username and password requirements are not being met");

            p.style.color = "red";



          }
        }
      } else {
        const li = document.getElementById('userMin');
        if (li) {
          li.className = "fa fa-check";
        }


      }

      if (!this.username.match("^[a-zA-Z0-9]*$")) {
        const li = document.getElementById('userAlf');
        if (li) {
          li.className = "fa fa-times";
          error = true;
          const p = document.getElementById('message');

          if (p) {

            p.textContent = ("Username and password requirements are not being met");

            p.style.color = "red";



          }
        }
      } else {
        const li = document.getElementById('userAlf');
        if (li) {
          li.className = "fa fa-check";
        }


      }

      if (this.password.length < 8) {
        const li = document.getElementById('passOito');
        if (li) {
          li.className = "fa fa-times";
          error = true;
          const p = document.getElementById('message');

          if (p) {

            p.textContent = ("Username and password requirements are not being met");

            p.style.color = "red";



          }
        }
      } else {
        const li = document.getElementById('passOito');
        if (li) {
          li.className = "fa fa-check";
        }


      }
      if (!this.containsUppercase(this.password)) {
        const li = document.getElementById('passMai');
        if (li) {
          li.className = "fa fa-times";
          error = true;
          const p = document.getElementById('message');

          if (p) {

            p.textContent = ("Username and password requirements are not being met");

            p.style.color = "red";



          }

        }
      } else {
        const li = document.getElementById('passMai');
        if (li) {
          li.className = "fa fa-check";

        }

      }
      if (!this.containsLowercase(this.password)) {
        const li = document.getElementById('passMin');
        if (li) {
          li.className = "fa fa-times";
          const p = document.getElementById('message');

          if (p) {

            p.textContent = ("Username and password requirements are not being met");

            p.style.color = "red";



          }
        }
      } else {
        {
          const li = document.getElementById('passMin');
          if (li) {
            li.className = "fa fa-check";
          }

        }

      }

      if (!this.containsNumber(this.password)) {
        const li = document.getElementById('passAlg');
        if (li) {
          li.className = "fa fa-times";
          error = true;
          const p = document.getElementById('message');

          if (p) {

            p.textContent = ("Username and password requirements are not being met");

            p.style.color = "red";



          }

        }
      } else {
        const li = document.getElementById('passAlg');
        if (li) {
          li.className = "fa fa-check";
        }

      }

      const resultado = await this.registarService.regist(this.username, this.password);
      if (error == false) {
        if (!resultado) {
          const li = document.getElementById('userUnic');
          if (li) {
            li.className = "fa fa-times";
            error = true;
            const p = document.getElementById('message');

            if (p) {

              p.textContent = ("Username and password requirements are not being met");

              p.style.color = "red";



            }
          }


        } else {
          const li = document.getElementById('userUnic');

          if (li) {
            li.className = "fa fa-check";

          }

        }


      }
      if (error == true) {
        //
      } else {
        if (await this.loginService.loginToken(this.username, this.password)) {
          const lo = document.getElementById("container1");

          if (lo) {
            lo.style.display = 'none';
          }

          const lo2 = document.getElementById("container2");

          if (lo2) {
            lo2.style.display = 'none';
          }
          const we = document.getElementById("welcome");

          if (we) {
            we.style.display = 'block';
          }

          await new Promise(s => setTimeout(s, 1500));
          this.router.navigate(['/dashboard']);

        } else {
          alert("Failed to login!");
        }
      }
    } else {
      const p = document.getElementById('message');

      if (p) {

        p.textContent = ("Passwords must match");

        p.style.color = "red";



      }
    }

  }





  private containsUppercase(word: string) {
    return /[A-Z]/.test(word);
  }

  private containsLowercase(word: string) {
    return /[a-z]/.test(word);
  }
  private containsNumber(word: string) {
    return /[0-9]/.test(word);
  }






}
