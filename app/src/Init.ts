'use strict';

namespace WeAreNotInSpace {
  export class Game extends Phaser.Game {
    constructor() {
      super({width: 1024, height: 768, renderer: Phaser.AUTO});

      this.state.add('boot', State.Boot);
      this.state.add('preload', State.Preload);
      this.state.add('menu', State.Menu);
      this.state.add('main', State.Main);

        let promise = new Promise(() => {

        });
      this.state.start('boot');
    }
  }
}

window.onload = () => {
  var game = new WeAreNotInSpace.Game();
};