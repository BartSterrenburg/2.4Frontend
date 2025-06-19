import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
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

  sendChat(): void {
    const message = this.chatForm.value.chat.trim();
    if (!message) return;

    const chatObj = { chat: message, userId: 1004 };
    this.http.post('http://localhost:3000/api/chat', chatObj).subscribe(() => {
      this.chats.push({ ...chatObj, createdAt: new Date().toISOString() });
      this.chatForm.reset();
    });
  }
}
