(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@guzzj/clappr-core')) :
  typeof define === 'function' && define.amd ? define(['@guzzj/clappr-core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PIPPlugin = factory(global.Clappr));
}(this, (function (clapprCore) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  var pipIcon = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"35px\" height=\"22px\" viewBox=\"0 0 35 22\" enable-background=\"new 0 0 35 22\" xml:space=\"preserve\">\n<rect x=\"0.5\" y=\"0.5\" fill=\"none\" stroke=\"#FFFFFF\" stroke-miterlimit=\"10\" width=\"34\" height=\"21\"/>\n<rect x=\"16.5\" y=\"11.5\" fill=\"#FFFFFF\" stroke=\"#FFFFFF\" stroke-miterlimit=\"10\" width=\"16\" height=\"8\"/>\n</svg>\n";

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
        return clapprCore.template(pipIcon);
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
        this.listenToOnce(this.core, clapprCore.Events.CORE_READY, this.init);
      }
    }, {
      key: "_bindEvents",
      value: function _bindEvents() {
        this.container = this.core.getCurrentContainer();
        this.listenTo(this.core.mediaControl, clapprCore.Events.MEDIACONTROL_RENDERED, this._init);
        this.listenTo(this.core.mediaControl, clapprCore.Events.MEDIACONTROL_CONTAINERCHANGED, this._onContainerChanged);
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
  }(clapprCore.UICorePlugin);

  return PIPPlugin;

})));
