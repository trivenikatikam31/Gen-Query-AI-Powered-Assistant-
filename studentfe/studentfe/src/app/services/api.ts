import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {

  BASE = environment.baseUrl;

  constructor(private http: HttpClient) {}

  headers() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
  }

  getProfile() {
    return this.http.get(this.BASE + environment.profileurl, this.headers());
  }
  
  uploadDocument(file: File, title: string) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('file', file);

  return this.http.post(
    this.BASE + environment.documentsUrl,
    formData,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
  );
}

getDocuments() {
  return this.http.get(
    this.BASE + environment.documentsUrl,
    {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
  );
}

createConversation(){
  return this.http.post(
   
   this.BASE + environment.conversationUrl,
   {},
   this.headers()
  );

}
askConversation(
  conversation_Id: number,
  question: string
){
    return this.http.post(
      this.BASE + environment.conversationAskUrl,
      {
        conversation_id: conversation_Id,
        question:question
      },
      this.headers()
    );
}

}