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
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
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

            //extend by data options
            self.data_options = self.$element.data('parallax-background');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.init();
        }

        _createClass(ParallaxBackground, [{
            key: 'init',
            value: function init() {

                var self = this;

                if (typeof TweenLite === 'undefined') {
                    console.warn('TweenMax or TweenLite library is required... https://greensock.com/tweenlite');
                    return;
                }

                if (typeof CSSPlugin === 'undefined') {
                    console.warn('CSSPlugin in required... https://greensock.com/CSSPlugin');
                    return;
                }

                var ww = 0,
                    wh = 0,
                    deviceOrientation = '',
                    viewport_top = 0,
                    viewport_bottom = 0;

                $(window).on('load resize', function () {
                    ww = window.innerWidth;
                    wh = window.innerHeight;

                    if (ww > wh) {
                        deviceOrientation = 'landscape';
                    } else {
                        deviceOrientation = 'portrait';
                    }
                });

                if (self.settings.event == 'scroll') {
                    $(window).on('load scroll', function () {

                        viewport_top = $(window).scrollTop();
                        viewport_bottom = viewport_top + wh;
                    });
                }

                var animateDuration = self.settings.animate_duration,
                    zoom = self.settings.zoom,
                    $thisSection = self.$element,
                    $thisInner = $thisSection.find('.parallax-inner'),
                    innerSize = zoom + 100,
                    coef = innerSize / 100,
                    shift = zoom / 2 / coef,
                    lastGamma = 0,
                    lastBeta = 0,
                    rangeGamma = 0,
                    rangeBeta = 0;

                $thisSection.css({
                    'overflow': 'hidden'
                });

                $thisInner.css({
                    'top': -zoom / 2 + '%',
                    'left': -zoom / 2 + '%',
                    'height': innerSize + '%',
                    'width': innerSize + '%',
                    'position': 'absolute'

                });

                if (self.settings.animation_type == 'rotate') {
                    TweenLite.set($thisSection, { perspective: self.settings.rotate_perspective });
                    TweenLite.set($thisInner, { transformStyle: "preserve-3d" });
                }

                if (self.settings.event == 'scroll') {

                    var section_offset_top = 0,
                        section_offset_bottom = 0,
                        animation_progress_px = 0,
                        animation_progress_percent = 0,
                        section_height = 0,
                        animation_length = 0;

                    $(window).on('load resize', function () {

                        section_height = $thisSection.outerHeight();

                        section_offset_top = $thisSection.offset().top;
                        section_offset_bottom = section_offset_top + section_height;

                        animation_length = section_height + wh;
                    });

                    $(window).on('scroll resize load', function () {

                        if (viewport_bottom > section_offset_top && viewport_top < section_offset_bottom) {

                            $thisSection.addClass('active');

                            animation_progress_px = viewport_bottom - section_offset_top - animation_length / 2;

                            animation_progress_percent = animation_progress_px / (animation_length / 2);

                            if (self.settings.animation_type == 'shift') {
                                TweenLite.to($thisInner, animateDuration, { y: shift * animation_progress_percent + '%' });
                            } else if (self.settings.animation_type == 'rotate') {
                                TweenLite.to($thisInner, animateDuration, { rotationX: shift * animation_progress_percent + '%' });
                            }
                        } else {
                            $thisSection.removeClass('active');
                        }
                    });
                } else if (self.settings.event == 'mouse_move') {

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

                        if (deviceOrientation == 'landscape') {
                            x = shift / coef / 100 * betaInPercent;
                            y = shift / coef / 100 * gamaInPercent;
                        } else {
                            x = shift / coef / 100 * gamaInPercent;
                            y = shift / coef / 100 * betaInPercent * -1;
                        }

                        if (self.settings.animation_type == 'shift') {
                            TweenLite.to($thisInner, animateDuration, { x: y + '%', y: x + '%' });
                        } else if (self.settings.animation_type == 'rotate') {
                            TweenLite.to($thisInner, animateDuration, { rotationX: -y + '%', rotationY: -x + '%' });
                        }
                    }, true);

                    $thisSection.on("mousemove", function (e) {

                        var offset = $thisSection.offset(),
                            sectionWidth = $thisSection.outerWidth(),
                            sectionHeight = $thisSection.outerHeight(),
                            pageX = e.pageX - offset.left - $thisSection.width() * 0.5,
                            pageY = e.pageY - offset.top - $thisSection.height() * 0.5,
                            cursorPercentPositionX = pageX / sectionWidth * 2,
                            cursorPercentPositionY = pageY / sectionHeight * 2,
                            x = shift * cursorPercentPositionX,
                            y = shift * cursorPercentPositionY;

                        if (self.settings.animation_type == 'shift') {
                            TweenLite.to($thisInner, animateDuration, { x: x + '%', y: y + '%' });
                        } else if (self.settings.animation_type == 'rotate') {
                            TweenLite.to($thisInner, animateDuration, { rotationX: y + '%', rotationY: -x + '%' });
                        }
                    });

                    $thisSection.mouseleave(function () {

                        if (self.settings.animation_type == 'shift') {

                            TweenLite.to($thisInner, animateDuration, { x: '0%', y: '0%' });
                        } else if (self.settings.animation_type == 'rotate') {
                            TweenLite.to($thisInner, animateDuration, { rotationX: 0, rotationY: 0 });
                        }
                    });
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