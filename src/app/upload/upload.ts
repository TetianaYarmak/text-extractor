import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.html',
  styleUrls: ['./upload.css']
})
export class UploadComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  extractedText: string | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  onFileSelected(event: any) {
    // очищаємо попередні дані
    this.selectedFile = event.target.files[0];
    this.imagePreview = null;
    this.extractedText = null;

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  extractText() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post<any>('https://api.api-ninjas.com/v1/imagetotext', formData, {
      headers: { 'X-Api-Key': '4b48j3mxOGU1CiRPfUsB5CsmPVWifGJfHylfj8Dj' }
    }).subscribe(
      res => {
        if (Array.isArray(res) && res.length > 0) {
          this.extractedText = res.map(r => r.text).join('\n');
        } else {
          this.extractedText = 'Text not found';
        }
        this.cdr.detectChanges();
      },
      err => {
        console.error(err);
        this.extractedText = 'Error occurred while recognizing text';
        this.cdr.detectChanges();
      }
    );
  }

  copyText() {
    if (this.extractedText) {
      navigator.clipboard.writeText(this.extractedText);
      window.alert('Text copied!');
    }
  }
}
