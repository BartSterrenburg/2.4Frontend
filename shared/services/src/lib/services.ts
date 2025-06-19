import { createSign } from 'crypto';

export class Services {
  createSignature(data: string, privKey: string): string {
    const signer = createSign('SHA256');
    signer.update(data);
    signer.end();
    return signer.sign(privKey, 'base64');
  }

  async sha256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  }

  async verifyHash(payload: 
    {
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
