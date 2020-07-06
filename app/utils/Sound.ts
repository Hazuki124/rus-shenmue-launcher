import { Howl } from 'howler';

export default class Sound {
  static click: Howl;

  static play: Howl;

  static getClickHowler() {
    if (Sound.click) {
      return Sound.click;
    }

    Sound.click = new Howl({
      src: ['./assets/audio/click.wav']
    });
    return Sound.click;
  }

  static getPlayHowler() {
    if (Sound.play) {
      return Sound.play;
    }

    Sound.play = new Howl({
      src: ['./assets/audio/play.wav']
    });
    return Sound.play;
  }

  static playClick() {
    Sound.getClickHowler().play();
  }

  static playPlay() {
    const playSound = Sound.getPlayHowler();
    playSound.play();
    return new Promise(resolve => {
      playSound.on('end', () => {
        resolve(true);
      });
    });
  }
}
