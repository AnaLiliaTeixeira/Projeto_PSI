import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { noop } from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private loginService:LoginService,private router:Router){}

  async tryLogin(){
    console.log(this.username);
    this.username = this.username.trim();
    this.password = this.password.trim();
    

    if(await this.loginService.loginToken(this.username,this.password)){
      
      const lo = document.getElementById("loginId");
      
      if(lo){
        lo.style.display='none';
      }
      const we = document.getElementById("welcome");
      
      if(we){
        we.style.display='block';
      }
      
      await new Promise(s => setTimeout(s, 1500));

      this.router.navigate(['/dashboard']);
      
    }else{

      const p = document.getElementById('message');

          if (p) {

            p.textContent = ("Failed to login!, check username and password");

            p.style.color = "red";



          }
    } 
  }

  goToRegistar(){
    
    this.router.navigate(['/regist']);
  }

}


