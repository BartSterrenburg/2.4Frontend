import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Services } from '@services';

@Component({
  standalone: true,
  selector: 'app-chatbox',
  templateUrl: './chatbox.html',
  styleUrls: ['./chatbox.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class ChatboxComponent implements OnInit {
  chatForm: FormGroup;
  chats: { chat: string; userId: number; createdAt?: string }[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private services: Services) {
    this.chatForm = this.fb.group({
      chat: [''],
    });
  }

  ngOnInit(): void {
    this.loadChats();
  }

  loadChats(): void {
    this.http.get<any[]>('http://localhost:3000/api/chat').subscribe((data) => {
      this.chats = data;
    });
  }

async sendChat(): Promise<void> {
  const message = this.chatForm.value.chat.trim();
  if (!message) return;

  const privateKey = this.services.getCookie('privateKey');
  if (!privateKey) {
    console.error('Private key ontbreekt!');
    return;
  }

  const timestamp = new Date().toISOString(); 
  const signedHash = await this.services.createSignature(`${message};${timestamp}`, privateKey);

  const chatObj = {
    chat: message,
    userId: 1004,
    timeStamp: timestamp,
    signature: signedHash
  };

  this.http.post('http://localhost:3000/api/chat', chatObj).subscribe(() => {
    this.chats.push({ ...chatObj, createdAt: new Date().toISOString() });
    this.chatForm.reset();
  });
}


}
