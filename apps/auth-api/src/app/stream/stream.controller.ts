// stream.controller.ts
import { Controller, Get } from '@nestjs/common';
import { StreamService } from './stream.service';
import { ApiResponse } from '@dto';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get()
  async getStreams() {
    const streamKeys = await this.streamService.getActiveStreamKeys();
    const count = streamKeys.length;
    return new ApiResponse(200, `${count} live stream(s) found`, streamKeys);
  }
}
