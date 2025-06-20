

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Services {
async createSignature(data: string, privateKeyPem: string): Promise<string> {
  const enc = new TextEncoder();
  const dataBuffer = enc.encode(data);

  // 1. Parse the PEM-format key
  const pemContents = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  // 2. Import de key
  const key = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer.buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  // 3. Signeren
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    dataBuffer
  );

  // 4. Return base64 string
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}


  getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  async sha256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hashBuffer)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async verifyHash(payload: {
    timestamp: number;
    streamKey: string;
    frameHash: string;
    finalHash: string;
  }): Promise<boolean> {
    const input = `${payload.timestamp}|${payload.frameHash}|${payload.streamKey}`;
    const calculated = await this.sha256(input);
    return calculated === payload.finalHash;
  }
}
