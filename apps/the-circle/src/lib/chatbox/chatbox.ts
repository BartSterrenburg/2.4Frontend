import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Services } from '@services';
import { VerifiedChat } from '@entity';

@Component({
  standalone: true,
  selector: 'app-chatbox',
  templateUrl: './chatbox.html',
  styleUrls: ['./chatbox.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class ChatboxComponent implements OnInit, OnDestroy {
  chatForm: FormGroup;
  chats: VerifiedChat[] = [];
  private intervalId: any;
  @Input() streamKey = '-';


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private services: Services
  ) {
    this.chatForm = this.fb.group({
      chat: [''],
    });
  }

  ngOnInit(): void {
    this.loadChats();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


loadChats(): void {
  this.http
    .get<VerifiedChat[]>(`http://localhost:3000/api/chat/${this.streamKey}`)
    .subscribe((data) => {
      this.chats = data;
    });
}


  startAutoRefresh(): void {
    this.intervalId = setInterval(() => {
      this.loadChats();
    }, 3000);
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

    const userId = this.services.getCookie('userId');
    if (!userId) return;

    const now = new Date();
    now.setMilliseconds(0);
    const timestamp = now.toISOString();

    const dataToSign = `${message};${timestamp}`;
    const signedHash = await this.services.createSignature(dataToSign, privateKey);

    const chatObj = {
      chat: message,
      userId: Number(userId),
      timeStamp: timestamp,
      signature: signedHash,
    };

    this.http.post('http://localhost:3000/api/chat', chatObj).subscribe({
      next: (response) => {
        console.log('[✅] Chat succesvol verstuurd. Response:', response);
        this.loadChats();
        this.chatForm.reset();
      },
      error: (err) => {
        console.error('[🔥] Fout bij versturen van chat:', err);
      },
    });
  }
}
