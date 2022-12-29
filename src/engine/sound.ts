export class Sound extends Audio {
  constructor(src: string) {
    super(src);
    this.autoplay = false;
  }

  start() {
    this.muted = false;
    this.play()
  }

  soundLoop(): void {
    super.loop = true;
    this.start();
  }

  stop() {
    this.pause();
    this.currentTime = 0;
  }
}