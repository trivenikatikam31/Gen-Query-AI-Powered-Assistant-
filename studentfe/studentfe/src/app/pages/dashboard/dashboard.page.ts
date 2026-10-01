import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from 'src/app/services/api';
import { Router } from '@angular/router';
import { Auth } from 'src/app/services/auth';

import { IonContent,IonCard,IonInput, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonButtons, IonTitle, IonToolbar, IonHeader } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent,IonCard,IonInput, IonButton, IonButtons, IonTitle,IonToolbar,IonHeader, IonCardHeader, IonCardTitle, IonCardContent, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {

 profile: any;
 conversationId: number | null=null;
 chatInput = '';
 chatLoading = false;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    sources?:{
      document_id:number;
      source:string;
      chunk_index: number;
    }[];
    confidence?: string;
  }[]=[];

  constructor(private api: Api, private auth: Auth, private router: Router) { }

  ngOnInit() {
    this.loadProfile();
    this.createNewConverstion();
  }

  loadProfile() {
    this.api.getProfile().subscribe({
      next: (res: any) => {
        console.log("PROFILE API RESPONSE:", res);
        this.profile = res[0];   // your API returns array
      },
      error: () => {
        this.router.navigateByUrl('/login');
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  goUpload() {
  console.log("🟢 Upload button clicked");

  console.log("Current URL before nav:", this.router.url);

  setTimeout(() => {
    this.router.navigate(['/upload-documents'])
      .then(success => {
        console.log("Navigation success:", success);
        console.log("Current URL after nav:", this.router.url);
      })
      .catch(err => {
        console.error("Navigation error:", err);
      });
  }, 0);
}

createNewConverstion(){
  this.api.createConversation().subscribe({
    next:(res:any)=> {
      this.conversationId = res.conversation_id;
      this.messages = [];
    },
    error:(error) => {
      console.error('CONVERSATION ERROR:', error);
    }
  });
}

sendMessage(){
  if (!this.chatInput.trim()){
    return;
  }
  if (!this.conversationId){
    return;
  }
  const question = this.chatInput.trim();
  this.messages.push({
    role:'user',
    content:question
  });
  this.chatInput = '',
  this.chatLoading = true;
  this.api.askConversation(
    this.conversationId,
    question
  ).subscribe({
    next: (res:any) => {
      this.messages.push({
        role: 'assistant',
        content: res.answer,
        sources:res.sources || [],
        confidence:res.confidence ||''
      });
      this.chatLoading = false; 
    },
    error: (error) => {
      console.error('CONVSERSATION ERROR:', error);
      this.messages.push({
        role:'assistant',
        content:'Unable to get an answer. Please try again'
      });
      this.chatLoading = false;
    }

  }
  );
}




}




