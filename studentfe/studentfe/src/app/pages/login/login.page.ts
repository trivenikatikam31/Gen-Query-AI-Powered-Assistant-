import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from 'src/app/services/auth';
import { Router } from '@angular/router';
import { IonContent, IonCard, IonInput, IonButton, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonCard, IonInput, IonButton, IonItem, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  form = {
    username: '',
    password: ''
  };

  errorMsg = '';

  constructor(private auth: Auth, private router: Router) { }

  ngOnInit() {
  }

  login() {
    if (!this.form.username || !this.form.password) {
      this.errorMsg = "Enter username & password";
      return;
    }

    this.auth.login(this.form).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.access);
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      },
      error: () => {
        this.errorMsg = "Invalid username or password";
      }
    });
  }

  goSignup() {
  console.log("Navigate to signup");
  this.router.navigate(['/signup']);
}

}
