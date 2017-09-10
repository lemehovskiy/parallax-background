'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function ($) {

    $.fn.parallaxBackground = function (method) {

        var methods = {

            init: function init(options) {

                var settings = $.extend({
                    type: 'scroll',
                    zoom: 30,
                    gyroPerspective: 1400,
                    gyroAnimationType: 'shift',
                    animate_duration: 0.5
                }, options);

                if (settings.type == 'scroll') {

                    var scrollTop = 0,
                        windowHeight = 0,
                        triggerPosition = 0,
                        zoom = settings.zoom,
                        shift = zoom / 2,
                        innerHeight = zoom + 100;

                    $(window).on('scroll load', function () {
                        scrollTop = $(window).scrollTop();
                        windowHeight = $(window).height();

                        triggerPosition = scrollTop + windowHeight;
                    });

                    this.each(function () {

                        var _section = $(this),
                            sectionHeight = _section.outerHeight(),
                            _sectionInner = _section.find('.parallax-inner'),
                            animationTriggerStart = 0,
                            animationTriggerEnd = 0,
                            offset = 0,
                            animationLength = 0,
                            coef = innerHeight / 100;

                        _section.css({
                            'overflow': 'hidden'
                        });

                        _sectionInner.css({
                            'top': -shift + '%',
                            'left': 0,
                            'height': innerHeight + '%',
                            'width': '100%',
                            'position': 'absolute'
                        });

                        $(window).on('load resize', function () {

                            offset = _section.offset();

                            animationTriggerStart = offset.top;

                            animationTriggerEnd = animationTriggerStart + windowHeight;

                            animationLength = animationTriggerEnd - animationTriggerStart;
                        });

                        $(window).on('scroll resize load', function () {

                            if (triggerPosition > animationTriggerStart && triggerPosition < animationTriggerEnd + sectionHeight) {

                                _section.addClass('active');

                                var centerPixelShift = triggerPosition - offset.top - animationLength * 0.5;

                                var centerPercentShift = centerPixelShift / (animationLength / 100) * 2;

                                var y = shift / coef / 100 * centerPercentShift;

                                _sectionInner.css({
                                    "transform": "translate3d(0," + y + "%, 0)"
                                });
                            } else {
                                _section.removeClass('active');
                            }
                        });
                    });
                } else if (settings.type == 'gyro') {

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
                        deviceOrientation = 0;

                    $(window).on('load resize', function () {
                        ww = window.innerWidth;
                        wh = window.innerHeight;

                        if (ww > wh) {
                            deviceOrientation = 'landscape';
                        } else {
                            deviceOrientation = 'portrait';
                        }
                    });

                    this.each(function () {

                        var animateDuration = settings.animate_duration,
                            zoom = settings.zoom,
                            shift = zoom / 2,
                            $thisSection = $(this),
                            $thisInner = $thisSection.find('.parallax-inner'),
                            innerSize = shift * 2 + 100,
                            coef = innerSize / 100,
                            lastGamma = 0,
                            lastBeta = 0,
                            rangeGamma = 0,
                            rangeBeta = 0;

                        $thisSection.css({
                            'overflow': 'hidden'
                        });

                        $thisInner.css({
                            'top': -shift + '%',
                            'left': -shift + '%',
                            'height': innerSize + '%',
                            'width': innerSize + '%',
                            'position': 'absolute'

                        });

                        if (settings.gyroAnimationType == 'rotate') {
                            TweenLite.set($thisSection, { perspective: settings.gyroPerspective });
                            TweenLite.set($thisInner, { transformStyle: "preserve-3d" });
                        }

                        window.addEventListener("deviceorientation", function (e) {

                            var roundedGamma = Math.round(e.gamma),
                                roundedBeta = Math.round(e.beta),
                                x = 0,
                                y = 0;

                            // $('.debug .gamma').text(roundedGamma);
                            // $('.debug .beta').text(roundedBeta);

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

                            // $('.debug .x').text(x);
                            // $('.debug .y').text(y);


                            if (settings.gyroAnimationType == 'shift') {
                                TweenLite.to($thisInner, animateDuration, { x: x + '%', y: y + '%' });
                            } else if (settings.gyroAnimationType == 'rotate') {
                                TweenLite.to($thisInner, animateDuration, { rotationX: -y + '%', rotationY: -x + '%' });
                            }
                        }, true);

                        $thisSection.on("mousemove", function (e) {

                            var offset = $thisSection.offset(),
                                sectionWidth = $thisSection.outerWidth(),
                                sectionHeight = $thisSection.outerHeight(),
                                pageX = e.pageX - offset.left - $thisSection.width() * 0.5,
                                pageY = e.pageY - offset.top - $thisSection.height() * 0.5,
                                cursorPercentPositionX = pageX / (sectionWidth / 100) * 2,
                                cursorPercentPositionY = pageY / (sectionHeight / 100) * 2,
                                x = shift / coef / 100 * cursorPercentPositionX,
                                y = shift / coef / 100 * cursorPercentPositionY;

                            // $('.debug .x').text(x);
                            // $('.debug .y').text(y);

                            if (settings.gyroAnimationType == 'shift') {
                                TweenLite.to($thisInner, animateDuration, { x: x + '%', y: y + '%' });
                            } else if (settings.gyroAnimationType == 'rotate') {
                                TweenLite.to($thisInner, animateDuration, { rotationX: y + '%', rotationY: -x + '%' });
                            }
                        });

                        $thisSection.mouseleave(function () {

                            if (settings.gyroAnimationType == 'shift') {

                                TweenLite.to($thisInner, animateDuration, { x: '0%', y: '0%' });
                            } else if (settings.gyroAnimationType == 'rotate') {
                                TweenLite.to($thisInner, animateDuration, { rotationX: 0, rotationY: 0 });
                            }
                        });
                    });
                }
            }
        };

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if ((typeof method === 'undefined' ? 'undefined' : _typeof(method)) === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('There is no method with the name ' + method + ', for jQuery.parallaxBackground');
        }
    };
})(jQuery);