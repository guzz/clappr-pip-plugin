import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import { template, Events, UICorePlugin } from '@guzzj/clappr-core';

var pipIcon = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"35px\" height=\"22px\" viewBox=\"0 0 35 22\" enable-background=\"new 0 0 35 22\" xml:space=\"preserve\">\n<rect x=\"0.5\" y=\"0.5\" fill=\"none\" stroke=\"#FFFFFF\" stroke-miterlimit=\"10\" width=\"34\" height=\"21\"/>\n<rect x=\"16.5\" y=\"11.5\" fill=\"#FFFFFF\" stroke=\"#FFFFFF\" stroke-miterlimit=\"10\" width=\"16\" height=\"8\"/>\n</svg>\n";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var PIPPlugin = /*#__PURE__*/function (_UICorePlugin) {
  _inherits(PIPPlugin, _UICorePlugin);

  var _super = _createSuper(PIPPlugin);

  function PIPPlugin(core) {
    var _this;

    _classCallCheck(this, PIPPlugin);

    _this = _super.call(this, core);
    _this._pipSupported = false;
    _this._currentPlayback = null;

    _this.$el.addClass("media-control-button media-control-icon").css({
      "float": "right",
      height: "100%"
    });

    _this.$el.click(function () {
      var video = _this._playback.el;

      if (!document.pictureInPictureElement) {
        video.requestPictureInPicture();
      } else {
        document.exitPictureInPicture();
      }
    });

    return _this;
  }

  _createClass(PIPPlugin, [{
    key: "name",
    get: function get() {
      return 'pip-plugin';
    }
  }, {
    key: "tagName",
    get: function get() {
      return 'button';
    }
  }, {
    key: "template",
    get: function get() {
      return template(pipIcon);
    }
  }, {
    key: "attributes",
    get: function get() {
      return {
        'class': this.name
      };
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      this.listenToOnce(this.core, Events.CORE_READY, this.init);
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      this.container = this.core.getCurrentContainer();
      this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this._init);
      this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this._onContainerChanged);
    }
  }, {
    key: "_onContainerChanged",
    value: function _onContainerChanged() {
      this._updatePlayback();

      this._renderPlugin();
    }
  }, {
    key: "_updatePlayback",
    value: function _updatePlayback(playback) {
      var playback = this.core.mediaControl.container.playback;

      if (this._playback === playback) {
        // not changed
        return;
      }

      this._playback = playback;

      this._checkPipSupport();
    }
  }, {
    key: "_checkPipSupport",
    value: function _checkPipSupport() {
      var el = this._playback.el;
      this._pipSupported = el && el.nodeName.toLowerCase() === "video" && (document.pictureInPictureEnabled || !el.disablePictureInPicture);
    }
  }, {
    key: "init",
    value: function init() {
      this._bindEvents();
    }
  }, {
    key: "_init",
    value: function _init() {
      this._updatePlayback();

      this._checkPipSupport();

      this.core.mediaControl.$el.find(".media-control-layer .media-control-right-panel .media-control-button[data-fullscreen]").first().after(this.el);

      this._renderPlugin();
    }
  }, {
    key: "_renderPlugin",
    value: function _renderPlugin() {
      if (this._pipSupported) {
        this.$el.show();
      } else {
        this.$el.hide();
      }
    }
  }, {
    key: "render",
    value: function render() {
      this.$el.html(this.template());
      return this;
    }
  }]);

  return PIPPlugin;
}(UICorePlugin);

export default PIPPlugin;
