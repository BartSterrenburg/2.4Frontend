import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Services {
 async createSignature(data: string, privateKeyPem: string): Promise<string> {
  console.log('[📝] Te signeren data:', data);

  const enc = new TextEncoder();
  const dataBuffer = enc.encode(data);
  console.log('[🔣] DataBuffer (UTF-8 bytes):', Array.from(dataBuffer));

  console.log('[🔐] Begin parsing van privateKey PEM...');
  const pemContents = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  console.log('[📦] DER-gecodeerde private key (length):', binaryDer.byteLength);

  console.log('[➡️] Start import van private key naar CryptoKey object...');
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
  console.log('[✅] Private key succesvol geïmporteerd als CryptoKey');

  console.log('[✍️] Start signing via SubtleCrypto...');
  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    dataBuffer
  );

  const base64Signature = this.bufferToBase64(signatureBuffer);
  console.log('[📧] Base64-encoded signature:', base64Signature);

  return base64Signature;
}


  bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
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
