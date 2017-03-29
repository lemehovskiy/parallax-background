(function ($) {


    $.fn.parallax = function (method) {

        var methods = {

            init: function (options) {

                let settings = $.extend({
                    type: 'scroll',
                    zoom: 30,
                    animateDuration: 0.5
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

                        var $thisSection = $(this);

                        // console.log(_);

                        // var parallaxSelectorParent = $(settings.parallaxParentSelector);

                        var animateDuration = settings.animateDuration;
                        var zoom = settings.zoom;
                        var shift = zoom / 2;
                        var $thisSection = $(this);
                        var $thisInner = $thisSection.find('.parallax-inner');
                        var innerSize = shift * 2 + 100;
                        var coef = innerSize / 100;

                        var lastGamma, lastBeta, rangeGamma = 0, rangeBeta = 0;

                        $thisInner.css({
                            'top': -shift + '%',
                            'left': -shift + '%',
                            'height': innerSize + '%',
                            'width': innerSize + '%'

                        });


                        window.addEventListener("deviceorientation", function (e) {


                            var roundedGamma = Math.round(e.gamma);
                            var roundedBeta = Math.round(e.beta);
                            var x, y;

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

                            var gamaInPercent = (100 / 15) * rangeGamma;
                            var betaInPercent = (100 / 15) * rangeBeta;


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


                            TweenLite.to($thisInner, animateDuration, {x: x + '%', y: y + '%'});


                        }, true);


                        $($thisSection).on("mousemove", function (e) {

                            var offset = $thisSection.offset();

                            var sectionWidth = $thisSection.outerWidth();
                            var sectionHeight = $thisSection.outerHeight();

                            var pageX = e.pageX - offset.left - ($thisSection.width() * 0.5);
                            var pageY = e.pageY - offset.top - ($thisSection.height() * 0.5);

                            var cursorPercentPositionX = pageX / (sectionWidth / 100) * 2;
                            var cursorPercentPositionY = pageY / (sectionHeight / 100) * 2;

                            var x = shift / coef / 100 * cursorPercentPositionX;
                            var y = shift / coef / 100 * cursorPercentPositionY;

                            TweenLite.to($thisInner, animateDuration, {x: x + '%', y: y + '%'});

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
            $.error('There is no method with the name '+ method + ', for jQuery.parallax');
        }
    };
    

})(jQuery);
