import { createSign } from 'crypto';

export class Services {
  createSignature(data: string, privKey: string): string {
    const signer = createSign('SHA256');
    signer.update(data);
    signer.end();
    return signer.sign(privKey, 'base64');
  }
}
