import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Api } from 'src/app/services/api';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.page.html',
  styleUrls: ['./upload-documents.page.scss'],
  standalone: true,
  imports: [IonContent,IonButtons, IonHeader,IonList, IonItem,IonCardContent,IonCardTitle,IonCardHeader, IonBackButton,IonCard,IonCardTitle,IonCardHeader, IonTitle, IonToolbar,IonButton,IonLabel,IonInput, CommonModule, FormsModule]
})
export class UploadDocumentsPage implements OnInit {

  BASE = environment.baseUrl;
  selectedFile!: File;
  title = '';
  docs: any[] = [];


  constructor(private api: Api) { }

  ngOnInit() {
    this.loadDocuments();
  }
  selectFile(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // upload document
  upload(fileInput?: HTMLInputElement) {
  if (!this.selectedFile) {
    alert("Select file");
    return;
  }
  
  if (!this.title || this.title.trim() === '') {
    this.title = this.selectedFile.name;   // auto title from filename
  }

  this.api.uploadDocument(this.selectedFile, this.title)
    .subscribe({
      next: () => {
        alert("Uploaded");
        this.title = '';
        this.selectedFile = undefined as any;

        // 🔹 clear file input UI (important)
        if (fileInput) {
          fileInput.value = '';
        }
        this.loadDocuments();
      },
      error: (err: any) => {
        console.error(err);
        alert("Upload failed");
      }
    });
}


  // load documents
  loadDocuments() {
    this.api.getDocuments().subscribe({
      next: (res: any) => {
        this.docs = res;
      },
      error: (err) => console.error(err)
    });
  }

  openDoc(doc: any) {
  console.log("📄 Clicked doc:", doc);

  let url = doc.file;

  // if backend returns /media/... then add BASE
  if (!url.startsWith('http')) {
    url = this.BASE + url;
  }

  console.log("🌐 Opening URL:", url);

  // Try opening
  const win = window.open(url, '_blank');

  if (!win) {
    console.error("❌ Popup blocked by browser");
    alert("Popup blocked. Allow popups for this site.");
  }
}

}



