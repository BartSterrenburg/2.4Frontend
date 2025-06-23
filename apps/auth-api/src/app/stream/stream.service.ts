// stream.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

@Injectable()
export class StreamService {
  private readonly nginxStatUrl = 'http://145.49.45.65:8080/STAT';
  
  async getActiveStreamKeys(): Promise<string[]> {
    const res = await axios.get(this.nginxStatUrl);
    const xml = res.data;
    const json = await parseStringPromise(xml);

    // Navigeren door de XML structuur (aanpassen aan daadwerkelijke vorm)
    const applications = json.rtmp.server[0].application || [];
    const liveApp = applications.find((app: any) => app.name[0] === 'live');

    if (!liveApp || !liveApp.live || !liveApp.live[0].stream) {
      return [];
    }

    const streams = liveApp.live[0].stream;
    const streamKeys = streams.map((stream: any) => stream.name[0]);

    return streamKeys;
  }
}
