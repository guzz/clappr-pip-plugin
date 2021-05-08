const playerElement = document.getElementById('player-wrapper')
Clappr.Log.setLevel(Clappr.Log.LEVEL_INFO);

const player = new Clappr.Player({
  source: 'http://tjenkinson.me/clappr-thumbnails-plugin/assets/video.mp4',
  plugins: [
    window.PIPPlugin
  ]
})

player.attachTo(playerElement)
