import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from 'src/app/services/auth';
import { Router } from '@angular/router';
import { IonContent, IonInput, IonButton, IonItem, IonTextarea, IonCard} from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonItem, IonTextarea, IonCard,CommonModule, FormsModule]
})
export class SignupPage implements OnInit {
  form = {
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    contact: '',
    course: '',
    address: ''
  };

  constructor(private auth: Auth, private router: Router) { }

  ngOnInit() {
  }

  signup() {
    console.log("Signup payload:", this.form);

    this.auth.register(this.form).subscribe({
      next: () => {
        alert("Signup successful ✅");
        this.router.navigate(['/login']);   // go to login
      },
      error: (err) => {
        console.log("Signup Error:", err.error);
        alert(JSON.stringify(err.error));
      }
    });
  }

}
