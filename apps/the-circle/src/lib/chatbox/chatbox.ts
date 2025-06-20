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
  console.log('[🟡] Chat input:', message);

  if (!message) {
    console.warn('[⚠️] Chat is leeg, versturen wordt afgebroken.');
    return;
  }

  const privateKey = this.services.getCookie('privateKey');
  console.log('[🔐] Ophalen van privateKey uit cookie...');

  if (!privateKey) {
    console.error('[❌] Private key ontbreekt! Chat wordt niet verstuurd.');
    return;
  }

  console.log('[✅] Private key gevonden (eerste 100 tekens):', privateKey.slice(0, 100), '...');

  const timestamp = new Date().toISOString();
  const dataToSign = `${message};${timestamp}`;
  console.log('[🖊️] Data om te signeren:', dataToSign);

  const signedHash = await this.services.createSignature(dataToSign, privateKey);
  console.log('[✍️] Signature (base64):', signedHash);

  const chatObj = {
    chat: message,
    userId: 1006,
    timeStamp: timestamp,
    signature: signedHash,
  };

  console.log('[📦] Payload dat verstuurd wordt naar backend:', chatObj);

  this.http.post('http://localhost:3000/api/chat', chatObj).subscribe({
    next: (response) => {
      console.log('[✅] Chat succesvol verstuurd. Response:', response);
      this.chats.push({ ...chatObj, createdAt: new Date().toISOString() });
      this.chatForm.reset();
    },
    error: (err) => {
      console.error('[🔥] Fout bij versturen van chat:', err);
    },
  });
}




}
