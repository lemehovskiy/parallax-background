/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 Version: 1.0.8
 Author: lemehovskiy
 Website: https://lemehovskiy.github.io/parallax-background
 Repo: https://github.com/lemehovskiy/parallax_background
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var ParallaxBackground = function () {
        function ParallaxBackground(element, options) {
            _classCallCheck(this, ParallaxBackground);

            var self = this;

            //extend by function call
            self.settings = $.extend(true, {

                event: 'scroll',
                animation_type: 'shift',
                zoom: 20,
                rotate_perspective: 1400,
                animate_duration: 1

            }, options);

            self.$element = $(element);
            self.$element_inner = self.$element.find('.parallax-inner');

            //extend by data options
            self.data_options = self.$element.data('parallax-background');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.inner_size = self.settings.zoom + 100;
            self.coef = self.inner_size / 100;
            self.shift = self.settings.zoom / 2 / self.coef;

            self.device_orientation = '';
            self.viewport_top = 0;
            self.viewport_bottom = 0;

            self.init();
        }

        _createClass(ParallaxBackground, [{
            key: 'init',
            value: function init() {

                if (typeof TweenLite === 'undefined') {
                    console.warn('TweenMax or TweenLite library is required... https://greensock.com/tweenlite');
                    return;
                }

                if (typeof CSSPlugin === 'undefined') {
                    console.warn('CSSPlugin in required... https://greensock.com/CSSPlugin');
                    return;
                }

                var self = this;

                self.set_elements_styles();

                self.update_window_size();
                self.update_orientation();

                $(window).on('resize', function () {
                    self.update_window_size();
                    self.update_orientation();
                });

                if (self.settings.event == 'scroll') {
                    self.update_viewports();

                    $(window).on('scroll', function () {
                        self.update_viewports();
                    });
                }

                if (self.settings.event == 'scroll') {
                    self.subscribe_scroll_event();
                } else if (self.settings.event == 'mouse_move') {
                    self.subscribe_mouse_move_event();
                }
            }
        }, {
            key: 'update_window_size',
            value: function update_window_size() {
                var self = this;

                self.ww = window.innerWidth;
                self.wh = window.innerHeight;
            }
        }, {
            key: 'update_viewports',
            value: function update_viewports() {
                var self = this;

                self.viewport_top = $(window).scrollTop();
                self.viewport_bottom = self.viewport_top + self.wh;
            }
        }, {
            key: 'set_elements_styles',
            value: function set_elements_styles() {
                var self = this;

                self.$element.css({
                    'overflow': 'hidden'
                });

                self.$element_inner.css({
                    'top': -self.settings.zoom / 2 + '%',
                    'left': -self.settings.zoom / 2 + '%',
                    'height': self.inner_size + '%',
                    'width': self.inner_size + '%',
                    'position': 'absolute'

                });

                if (self.settings.animation_type == 'rotate') {
                    TweenLite.set(self.$element, { perspective: self.settings.rotate_perspective });
                    TweenLite.set(self.$element_inner, { transformStyle: "preserve-3d" });
                }
            }
        }, {
            key: 'update_orientation',
            value: function update_orientation() {
                var self = this;

                if (self.ww > self.wh) {
                    self.device_orientation = 'landscape';
                } else {
                    self.device_orientation = 'portrait';
                }
            }
        }, {
            key: 'subscribe_mouse_move_event',
            value: function subscribe_mouse_move_event() {

                var self = this;

                var lastGamma = 0,
                    lastBeta = 0,
                    rangeGamma = 0,
                    rangeBeta = 0;

                window.addEventListener("deviceorientation", function (e) {

                    var roundedGamma = Math.round(e.gamma),
                        roundedBeta = Math.round(e.beta),
                        x = 0,
                        y = 0;

                    if (roundedGamma > lastGamma && rangeGamma < 15) {
                        rangeGamma++;
                    } else if (roundedGamma < lastGamma && rangeGamma > -15) {
                        rangeGamma--;
                    }

                    if (roundedBeta > lastBeta && rangeBeta < 15) {
                        rangeBeta++;
                    } else if (roundedBeta < lastBeta && rangeBeta > -15) {
                        rangeBeta--;
                    }

                    lastGamma = roundedGamma;
                    lastBeta = roundedBeta;

                    var gamaInPercent = 100 / 15 * rangeGamma,
                        betaInPercent = 100 / 15 * rangeBeta;

                    //TODO Organize orientation statement

                    if (self.device_orientation == 'landscape') {
                        x = self.shift / self.coef / 100 * betaInPercent;
                        y = self.shift / self.coef / 100 * gamaInPercent;
                    } else {
                        x = self.shift / self.coef / 100 * gamaInPercent;
                        y = self.shift / self.coef / 100 * betaInPercent * -1;
                    }

                    if (self.settings.animation_type == 'shift') {
                        TweenLite.to(self.$element_inner, self.settings.animate_duration, { x: y + '%', y: x + '%' });
                    } else if (self.settings.animation_type == 'rotate') {
                        TweenLite.to(self.$element_inner, self.settings.animate_duration, { rotationX: -y + '%', rotationY: -x + '%' });
                    }
                }, true);

                self.$element.on("mousemove", function (e) {

                    var offset = self.$element.offset(),
                        sectionWidth = self.$element.outerWidth(),
                        sectionHeight = self.$element.outerHeight(),
                        pageX = e.pageX - offset.left - self.$element.width() * 0.5,
                        pageY = e.pageY - offset.top - self.$element.height() * 0.5,
                        cursorPercentPositionX = pageX / sectionWidth * 2,
                        cursorPercentPositionY = pageY / sectionHeight * 2,
                        x = self.shift * cursorPercentPositionX,
                        y = self.shift * cursorPercentPositionY;

                    if (self.settings.animation_type == 'shift') {
                        TweenLite.to(self.$element_inner, self.settings.animate_duration, { x: x + '%', y: y + '%' });
                    } else if (self.settings.animation_type == 'rotate') {
                        TweenLite.to(self.$element_inner, self.settings.animate_duration, { rotationX: y + '%', rotationY: -x + '%' });
                    }
                });

                self.$element.mouseleave(function () {

                    if (self.settings.animation_type == 'shift') {

                        TweenLite.to(self.$element_inner, self.settings.animate_duration, { x: '0%', y: '0%' });
                    } else if (self.settings.animation_type == 'rotate') {
                        TweenLite.to(self.$element_inner, self.settings.animate_duration, { rotationX: 0, rotationY: 0 });
                    }
                });
            }
        }, {
            key: 'subscribe_scroll_event',
            value: function subscribe_scroll_event() {

                var self = this;

                var section_offset_top = 0,
                    section_offset_bottom = 0,
                    animation_progress_px = 0,
                    animation_progress_percent = 0,
                    section_height = 0,
                    animation_length = 0;

                on_resize();
                on_resize_scroll();

                $(window).on('resize', function () {
                    on_resize();
                });

                $(window).on('scroll resize', function () {
                    on_resize_scroll();
                });

                function on_resize() {
                    section_height = self.$element.outerHeight();

                    section_offset_top = self.$element.offset().top;
                    section_offset_bottom = section_offset_top + section_height;

                    animation_length = section_height + self.wh;
                }

                function on_resize_scroll() {
                    if (self.viewport_bottom > section_offset_top && self.viewport_top < section_offset_bottom) {

                        self.$element.addClass('active');

                        animation_progress_px = self.viewport_bottom - section_offset_top - animation_length / 2;

                        animation_progress_percent = animation_progress_px / (animation_length / 2);

                        if (self.settings.animation_type == 'shift') {
                            TweenLite.to(self.$element_inner, self.settings.animate_duration, { y: self.shift * animation_progress_percent + '%' });
                        } else if (self.settings.animation_type == 'rotate') {
                            TweenLite.to(self.$element_inner, self.settings.animate_duration, { rotationX: self.shift * animation_progress_percent + '%' });
                        }
                    } else {
                        self.$element.removeClass('active');
                    }
                }
            }
        }]);

        return ParallaxBackground;
    }();

    $.fn.parallaxBackground = function () {
        var $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i = void 0,
            ret = void 0;
        for (i = 0; i < length; i++) {
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' || typeof opt == 'undefined') $this[i].parallax_background = new ParallaxBackground($this[i], opt);else ret = $this[i].parallax_background[opt].apply($this[i].parallax_background, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };
})(jQuery);

/***/ })
/******/ ]);