import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.html',
  styleUrls: ['./startscreen.css']
})
export class StartscreenComponent implements AfterViewInit {
  @ViewChild('videoPlayer1') videoPlayer1!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoPlayer2') videoPlayer2!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoPlayer3') videoPlayer3!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoPlayer4') videoPlayer4!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const streams = [
      { videoEl: this.videoPlayer1.nativeElement, url: 'http://145.49.9.94:8080/hls/RenzeStreamKey.m3u8' },
      { videoEl: this.videoPlayer2.nativeElement, url: 'http://145.49.9.94/hls/Stream2.m3u8' },
      { videoEl: this.videoPlayer3.nativeElement, url: 'http://145.49.9.94/hls/Stream3.m3u8' },
      { videoEl: this.videoPlayer4.nativeElement, url: 'http://145.49.9.94/hls/Stream4.m3u8' },
    ];

    streams.forEach(({ videoEl, url }, index) => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoEl);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoEl.play().catch(err => {
            console.error(`Fout bij video ${index + 1} afspelen:`, err);
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error(`HLS.js error bij video ${index + 1}:`, data);
        });
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = url;
        videoEl.addEventListener('loadedmetadata', () => {
          videoEl.play().catch(err => {
            console.error(`Fout bij native video ${index + 1} afspelen:`, err);
          });
        });
      } else {
        console.error(`HLS niet ondersteund voor video ${index + 1}`);
      }
    });
  }
}
