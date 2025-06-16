import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, VerifyDataDto } from '@dto';
import { createSign } from 'crypto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return this.authService.login(username, password);
  }

  // GET /auth/public-key/:id
  @Get('user/:id/key')
  async returnPublicKey(@Param('id') id: string) {
    const key = await this.authService.getPublicKeyById(+id);
    if (!key) {
      throw new NotFoundException('Publieke sleutel niet gevonden');
    }
    return { publicKey: key };
  }
  
  
  // POST /auth/verify-data	
  @Post('auth/verify-data')
  async verifyData(@Body() dto: VerifyDataDto) {
    return this.authService.verifyData(dto);
  }

  @Get('auth/verify-data/wrong')
  async verifyDataTestWrong() {
    const dto = {
      userId: 5,
      data: "hier klopt helemaal niets van",
      signature: "klopt al helemaal niet"
    };
    return this.authService.verifyData(dto);
  }

  @Get('auth/verify-data/correct')
async verifyDataTestCorrect() {
  const userId = 4;
  const data = 'test-bericht';

  // ⚠️ Gebruik hier de juiste private key van deze user na een login
  const privateKey = `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDIa2zq2Y4BzbZa\nlWC2Bag79H4HjxJcDB2wHkbJ3hTY7+fiUHvLE3RAfLVfC0Z77pv9utH2GEwgnosV\nMEqpB0uyO9sQYeGvcx6ke3piQ4TfsECR2h8UyFQSXM+mMu9UulZ4gLs3szyB5WZl\neU/uesOChhyVKNe0wPg8U9GyaVKnD0VG3uDTW+ML78eX0R3//G5wy55/Fqfcvtmx\n5/5xYzWig7bjFH1hDsYlzTgyob3Ts3+4VL/rZ3oAdiyJvYa2/Q5QvjKBkMne2EoK\nP303msOOaNbeBQtLsc/cBYbSGiNzfayxYpE2hFnBMP5MWF500Qe+Zyk/1uCAWUpy\nBo+hkUoTAgMBAAECggEAHTeb7zi7/QNSPC5epOp6NhNUdCGlWYniohQn2bHodB+1\nPEbjZR126xfDERIBunt0fi7IAQpVvsOeHv6lQ7LulBMpwl+imQM9Slk95ClXq4x0\nPU8BDPSPXQXut5nhTgbEKFkL8fjNL1qT7OMchfWbnuGSNSR5Hb6r8Y9+mHXGONg9\nAqQYDh0LfLiyOmVBe0bjQ26JxtDIavhBuPqCvmeKO5HJucSrXxsynuYK+BRsMLjq\n/PRP1SQn276GCXKcxlRKonRf/K8FYpBCyBcAZ0KBn2rYdFK8J87rvBxibkoUpYx4\nqsWdZ1jWlM3sgtuRY3xNP8Hma74TAg7/NOSw6lOagQKBgQDlphnvNcAe8OS1zrZJ\nIq/XUBOMNBZg2fk2o/Gv4MZ0pm5nNY/dLtBoAq4LaZLDrJYOSGwam2mt3SREWMen\nApSVhryGfkdTSWYloHMfGgysG2qUPE6aMZo+hjIYCvr+sjSX7UXgGvyq8SUchCec\nJ1ddpp6/xeR1j9EOUL9iGjAWoQKBgQDfariLvDuHZPBo5NMhl1qriX43IG9/VzZD\nyrNF6ZB28m+8lbal/XEtsGvP9smEYnaSPNssbYUV7yqhnSQ5LMvoxb7wvZfBrLal\n4KrA4AJbx1Tdh4dgeXQhTeQxIZFtHJK1SetG63QEZ9qLNofIYjkRkub0H6JjOBMp\nAFKmuO/IMwKBgF1MAuNE4f1v/mrCRRonRmrh9F8UVjcYtv900V6ToeyIJPg3MXA5\ncZ+f3xdx15c5SWkaERkqJF/nJLHDo7D9AmJQ78xwBwgWHLKSodJz4cwWA1Gfwosw\nNarLGBTeeSP6QBWs5qNqM1Y7S8lvAyyUaxD3/SyJ+Auu1s7LDUWMwBahAoGBAMvW\nwP2tBdsoOzhY3lEdmLo9Pgzp6RCT74y2mg5FZWtBErVLG1QjAmofNp6NmZrRg0E1\niPrmCbDTf1/o0a3gs0JzeRyIvrcT76k0bFaBi2VVXpaoGtnotg3U1UgGSnr0wN3q\nzWDtXfLPFlRBsm0fQNZJ47IEUtKXzNNx2fcHcK6FAoGBAJ9Kje6Kg+WuJo6pW3ZU\ngiefREl5zaNPtHgiTgU/HivLlCINxdP6nchQoNqm3LSCjRAMqmIflolTM7cPaslr\njjwbXIlvfGKYvj2NNhdFO2ItX9pOnzg9WA2KcXU3J4GYTMz1yHiPBIEcVEU/1z3P\nbSDoMpXGTu7JWR/RIc5Nh/Yv\n-----END PRIVATE KEY-----\n`;

  const signer = createSign('SHA256');
  signer.update(data);
  signer.end();
  const signature = signer.sign(privateKey, 'base64');

  const dto = {
    userId,
    data,
    signature,
  };

  return this.authService.verifyData(dto);
}

}
