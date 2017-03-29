(function ($) {


    $.fn.parallax = function (method) {

        var methods = {

            init: function (options) {

                let settings = $.extend({
                    type: 'scroll',
                    zoom: 30,
                    animateDuration: 0.5,
                    perspective: 1000,
                    gyroAnimationType: 'shift'
                }, options);


                if (settings.type == 'scroll') {

                    let scrollTop, windowHeight, triggerPosition;
                    let zoom = settings.zoom;
                    let shift = zoom / 2;
                    let innerHeight = zoom + 100;


                    $(window).on('scroll load', function () {
                        scrollTop = $(window).scrollTop();
                        windowHeight = $(window).height();

                        triggerPosition = scrollTop + windowHeight;
                    });


                    this.each(function () {


                        let _section = $(this);
                        let sectionHeight = _section.outerHeight();

                        let _sectionInner = _section.find('.parallax-inner');

                        let animationTriggerStart, animationTriggerEnd;

                        let offset, animationLength;

                        let coef = innerHeight / 100;


                        _sectionInner.css({
                            'top': -shift + '%',
                            'left': 0,
                            'height': innerHeight + '%',
                            'width': '100%'
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

                                let centerPixelShift = triggerPosition - offset.top - (animationLength * 0.5);

                                let centerPercentShift = centerPixelShift / (animationLength / 100) * 2;

                                let y = shift / coef / 100 * centerPercentShift;


                                TweenLite.to(_sectionInner, settings.animateDuration, {
                                    y: y + '%',
                                    ease: Linear.easeNone
                                });

                            }

                            else {
                                _section.removeClass('active');
                            }

                        })


                    });
                }

                else if (settings.type == 'gyro') {

                    let ww, wh, deviceOrientation;

                    $(window).on('load resize', function () {
                        ww = window.innerWidth;
                        wh = window.innerHeight;

                        if (ww > wh) {
                            deviceOrientation = 'landscape'
                        }

                        else {
                            deviceOrientation = 'portrait'
                        }


                        $('.debug .orientation').text(deviceOrientation);

                    });

                    this.each(function () {

                        let animateDuration = settings.animateDuration;
                        let zoom = settings.zoom;
                        let shift = zoom / 2;
                        let $thisSection = $(this);
                        let $thisInner = $thisSection.find('.parallax-inner');


                        let innerSize = shift * 2 + 100;
                        let coef = innerSize / 100;

                        let lastGamma, lastBeta, rangeGamma = 0, rangeBeta = 0;


                        $thisInner.css({
                            'top': -shift + '%',
                            'left': -shift + '%',
                            'height': innerSize + '%',
                            'width': innerSize + '%'

                        });


                        if (settings.gyroAnimationType == 'rotate') {
                            TweenLite.set($thisSection, {perspective: settings.perspective});
                            TweenLite.set($thisInner, {transformStyle: "preserve-3d"});
                        }


                        window.addEventListener("deviceorientation", function (e) {


                            let roundedGamma = Math.round(e.gamma),
                                roundedBeta = Math.round(e.beta),
                                x,
                                y;

                            $('.debug .gamma').text(roundedGamma);
                            $('.debug .beta').text(roundedBeta);

                            if (roundedGamma > lastGamma && rangeGamma < 15) {
                                rangeGamma++;
                            }
                            else if (roundedGamma < lastGamma && rangeGamma > -15) {
                                rangeGamma--;
                            }

                            if (roundedBeta > lastBeta && rangeBeta < 15) {
                                rangeBeta++;
                            }
                            else if (roundedBeta < lastBeta && rangeBeta > -15) {
                                rangeBeta--;
                            }

                            lastGamma = roundedGamma;
                            lastBeta = roundedBeta;

                            let gamaInPercent = (100 / 15) * rangeGamma,
                                betaInPercent = (100 / 15) * rangeBeta;


                            //TODO Organize orientation statement

                            if (deviceOrientation == 'landscape') {
                                x = shift / coef / 100 * betaInPercent;
                                y = shift / coef / 100 * gamaInPercent;
                            }

                            else {
                                x = shift / coef / 100 * gamaInPercent;
                                y = (shift / coef / 100 * betaInPercent) * -1;
                            }


                            $('.debug .x').text(x);
                            $('.debug .y').text(y);


                            if (settings.gyroAnimationType == 'shift') {
                                TweenLite.to($thisInner, animateDuration, {x: x + '%', y: y + '%'});
                            }

                            else if (settings.gyroAnimationType == 'rotate') {
                                TweenLite.to($thisInner, animateDuration, {rotationX: -y + '%', rotationY: -x + '%'});
                            }


                        }, true);


                        $thisSection.on("mousemove", function (e) {

                            let offset = $thisSection.offset();

                            let sectionWidth = $thisSection.outerWidth();
                            let sectionHeight = $thisSection.outerHeight();

                            let pageX = e.pageX - offset.left - ($thisSection.width() * 0.5);
                            let pageY = e.pageY - offset.top - ($thisSection.height() * 0.5);

                            let cursorPercentPositionX = pageX / (sectionWidth / 100) * 2;
                            let cursorPercentPositionY = pageY / (sectionHeight / 100) * 2;

                            let x = shift / coef / 100 * cursorPercentPositionX;
                            let y = shift / coef / 100 * cursorPercentPositionY;


                            $('.debug .x').text(x);
                            $('.debug .y').text(y);

                            if (settings.gyroAnimationType == 'shift') {
                                TweenLite.to($thisInner, animateDuration, {x: x + '%', y: y + '%'});
                            }

                            else if (settings.gyroAnimationType == 'rotate') {
                                TweenLite.to($thisInner, animateDuration, {rotationX: y + '%', rotationY: -x + '%'});
                            }

                        });


                        $thisSection.mouseleave(function() {

                            if (settings.gyroAnimationType == 'shift') {
                                TweenLite.to($thisInner, animateDuration, {x: 0, y: 0});
                            }

                            else if (settings.gyroAnimationType == 'rotate') {
                                TweenLite.to($thisInner, animateDuration, {rotationX: 0, rotationY: 0});
                            }

                        });
                    });
                }
            }
        };


        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('There is no method with the name ' + method + ', for jQuery.parallax');
        }
    };


})(jQuery);
