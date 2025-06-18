import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';

@Component({
  standalone: true,
  selector: 'app-startscreen',
  templateUrl: './startscreen.html',
  styleUrls: ['./startscreen.css'],
  imports: [CommonModule, FormsModule]
})
export class StartscreenComponent implements AfterViewInit {
  @ViewChildren('videoPlayer') videoPlayers!: QueryList<ElementRef<HTMLVideoElement>>;

  baseUrl = 'http://145.49.26.12/hls/';
  streamCount = 4;

  streams = [
    { name: '', url: this.baseUrl, hls: null as Hls | null, newName: '' },
    { name: '', url: this.baseUrl, hls: null as Hls | null, newName: '' },
    { name: '', url: this.baseUrl, hls: null as Hls | null, newName: '' },
    { name: '', url: this.baseUrl, hls: null as Hls | null, newName: '' }
  ];

  playingStates: boolean[] = [false, false, false, false];

  ngAfterViewInit(): void {
    this.videoPlayers.forEach((videoRef, index) => {
      this.startStream(videoRef.nativeElement, this.streams[index], index);
    });
  }

  startStream(videoEl: HTMLVideoElement, stream: any, index: number) {
    if (stream.url === this.baseUrl) {
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(stream.url);
      hls.attachMedia(videoEl);
      stream.hls = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoEl.play().then(() => {
          this.playingStates[index] = true;
        }).catch(err => console.error(`Fout bij video ${index + 1}:`, err));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error(`HLS.js error bij video ${index + 1}:`, data);
      });
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = stream.url;
      videoEl.addEventListener('loadedmetadata', () => {
        videoEl.play().then(() => {
          this.playingStates[index] = true;
        }).catch(err => console.error(`Fout bij native video ${index + 1}:`, err));
      });
    } else {
      console.error(`HLS niet ondersteund voor video ${index + 1}`);
    }
  }

  togglePlay(index: number) {
    const videoEl = this.videoPlayers.get(index)!.nativeElement;
    if (videoEl.paused) {
      videoEl.play().then(() => this.playingStates[index] = true);
    } else {
      videoEl.pause();
      this.playingStates[index] = false;
    }
  }

  closeStream(index: number, resetUrl = true) {
    const videoEl = this.videoPlayers.get(index)!.nativeElement;
    const stream = this.streams[index];

    if (stream.hls) {
      stream.hls.destroy();
      stream.hls = null;
    }

    videoEl.src = '';
    this.playingStates[index] = false;

    if (resetUrl) {
      stream.url = this.baseUrl;
      stream.name = '';
    }
  }

  loadNewStream(index: number) {
    const stream = this.streams[index];

    if (!stream.newName || !stream.newName.trim()) {
      console.warn('Geen geldige streamer naam ingevoerd');
      return;
    }

    const trimmedName = stream.newName.trim();
    const newUrl = `${this.baseUrl}${trimmedName}.m3u8`;

    this.closeStream(index, false);
    stream.name = trimmedName;
    stream.url = newUrl;

    const videoEl = this.videoPlayers.get(index)!.nativeElement;
    this.startStream(videoEl, stream, index);
  }

  goFullscreen(index: number) {
    const videoEl = this.videoPlayers.get(index)!.nativeElement;
    if (videoEl.requestFullscreen) {
      videoEl.requestFullscreen();
    } else if ((videoEl as any).webkitRequestFullscreen) {
      (videoEl as any).webkitRequestFullscreen();
    } else if ((videoEl as any).mozRequestFullScreen) {
      (videoEl as any).mozRequestFullScreen();
    } else if ((videoEl as any).msRequestFullscreen) {
      (videoEl as any).msRequestFullscreen();
    }
  }

  isDefaultStream(stream: any): boolean {
    return stream.url === this.baseUrl;
  }

  updateStreamCount() {
    const currentLength = this.streams.length;
    if (this.streamCount > currentLength) {
      for (let i = currentLength; i < this.streamCount; i++) {
        this.streams.push({ name: '', url: this.baseUrl, hls: null, newName: '' });
        this.playingStates.push(false);
      }
    } else if (this.streamCount < currentLength) {
      for (let i = this.streamCount; i < currentLength; i++) {
        this.closeStream(i);
      }
      this.streams.splice(this.streamCount);
      this.playingStates.splice(this.streamCount);
    }
  }
}
