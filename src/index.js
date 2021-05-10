import {UICorePlugin, Styler, Events, template} from '@clappr/core'
import pipIcon from './icons/pip.html'

export default class PIPPlugin extends UICorePlugin {
  get name() { return 'pip-plugin' }
  get tagName() { return 'button' }
  get template() { return template(pipIcon) }
  
  get attributes() {
    return {
      'class': this.name
    }
  }

  constructor(core) {
    super(core)
    this._pipSupported = false
    this._currentPlayback = null
    this.$el.addClass("media-control-button media-control-icon").css({
      float: "right",
      height: "100%"
    })
    this.$el.click(() => {
      var video = this._playback.el
      if (!document.pictureInPictureElement) {
        video.requestPictureInPicture()
      } else {
        document.exitPictureInPicture()
      }
    })
  }

  bindEvents() {
    this.listenToOnce(this.core, Events.CORE_READY, this.init)
  }

  _bindEvents() {
    this.container = this.core.getCurrentContainer()
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this._init)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this._onContainerChanged)
  }

  _onContainerChanged() {
    this._updatePlayback()
    this._renderPlugin()
  }

  _updatePlayback(playback) {
    var playback = this.core.mediaControl.container.playback
    if (this._playback === playback) {
      // not changed
      return
    }
    this._playback = playback
    this._checkPipSupport()
  }

  _checkPipSupport() {
    var el = this._playback.el
    this._pipSupported = el && el.nodeName.toLowerCase() === "video" && (document.pictureInPictureEnabled || !el.disablePictureInPicture)
  }

  init() {
    this._bindEvents()
  }

  _init() {
    this._updatePlayback()
    this._checkPipSupport()
    this.core.mediaControl.$el.find(".media-control-layer .media-control-right-panel .media-control-button[data-fullscreen]").first().after(this.el)
    this._renderPlugin()
  }

  _renderPlugin() {
    if (this._pipSupported) {
      this.$el.show()
    }
    else {
      this.$el.hide()
    }
  }

  render() {
    this.$el.html(this.template())
    return this
  }
}
