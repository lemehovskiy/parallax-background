/*
 Version: 1.0.6
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/parallax_background
 */

'use strict';

(function ($) {

    class ParallaxBackground {

        constructor(element, options) {

            let self = this;

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

        init() {

            if (typeof TweenLite === 'undefined') {
                console.warn('TweenMax or TweenLite library is required... https://greensock.com/tweenlite');
                return;
            }

            if (typeof CSSPlugin === 'undefined') {
                console.warn('CSSPlugin in required... https://greensock.com/CSSPlugin');
                return;
            }

            let self = this;
            
            self.set_elements_styles();
            
            $(window).on('load resize', function () {
                self.update_window_size();
                self.update_orientation();
            });
            
            if (self.settings.event == 'scroll') {
                $(window).on('load scroll', function () {
                    self.update_viewports();
                });
            }

            if (self.settings.event == 'scroll') {
                self.event_scroll()
            }

            else if (self.settings.event == 'mouse_move') {
                self.event_mouse_move();
            }

        }
        
        update_window_size(){
            let self = this;

            self.ww = window.innerWidth;
            self.wh = window.innerHeight;
        }
        
        update_viewports(){
            let self = this;
            
            self.viewport_top = $(window).scrollTop();
            self.viewport_bottom = self.viewport_top + self.wh;
        }
        
        set_elements_styles(){
            let self = this;
            
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
                TweenLite.set(self.$element, {perspective: self.settings.rotate_perspective});
                TweenLite.set(self.$element_inner, {transformStyle: "preserve-3d"});
            }
        }
        
        update_orientation(){
            let self = this;
            
            if (self.ww > self.wh) {
                self.device_orientation = 'landscape'
            }

            else {
                self.device_orientation = 'portrait'
            }
        }

        event_mouse_move(){

            let self = this;

            let lastGamma = 0,
                lastBeta = 0,
                rangeGamma = 0,
                rangeBeta = 0;

            window.addEventListener("deviceorientation", function (e) {

                let roundedGamma = Math.round(e.gamma),
                    roundedBeta = Math.round(e.beta),
                    x = 0,
                    y = 0;

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

                if (self.device_orientation == 'landscape') {
                    x = self.shift / self.coef / 100 * betaInPercent;
                    y = self.shift / self.coef / 100 * gamaInPercent;
                }

                else {
                    x = self.shift / self.coef / 100 * gamaInPercent;
                    y = (self.shift / self.coef / 100 * betaInPercent) * -1;
                }


                if (self.settings.animation_type == 'shift') {
                    TweenLite.to(self.$element_inner, self.settings.animate_duration, {x: y + '%', y: x + '%'});
                }

                else if (self.settings.animation_type == 'rotate') {
                    TweenLite.to(self.$element_inner, self.settings.animate_duration, {rotationX: -y + '%', rotationY: -x + '%'});
                }


            }, true);


            self.$element.on("mousemove", function (e) {

                let offset = self.$element.offset(),

                    sectionWidth = self.$element.outerWidth(),
                    sectionHeight = self.$element.outerHeight(),

                    pageX = e.pageX - offset.left - (self.$element.width() * 0.5),
                    pageY = e.pageY - offset.top - (self.$element.height() * 0.5),

                    cursorPercentPositionX = pageX / sectionWidth * 2,
                    cursorPercentPositionY = pageY / sectionHeight * 2,

                    x = self.shift * cursorPercentPositionX,
                    y = self.shift * cursorPercentPositionY;


                if (self.settings.animation_type == 'shift') {
                    TweenLite.to(self.$element_inner, self.settings.animate_duration, {x: x + '%', y: y + '%'});

                }

                else if (self.settings.animation_type == 'rotate') {
                    TweenLite.to(self.$element_inner, self.settings.animate_duration, {rotationX: y + '%', rotationY: -x + '%'});
                }

            });


            self.$element.mouseleave(function () {

                if (self.settings.animation_type == 'shift') {

                    TweenLite.to(self.$element_inner, self.settings.animate_duration, {x: '0%', y: '0%'});
                }

                else if (self.settings.animation_type == 'rotate') {
                    TweenLite.to(self.$element_inner, self.settings.animate_duration, {rotationX: 0, rotationY: 0});
                }

            });
        }

        event_scroll() {

            let self = this;

            let section_offset_top = 0,
                section_offset_bottom = 0,

                animation_progress_px = 0,

                animation_progress_percent = 0,

                section_height = 0,
                animation_length = 0;


            $(window).on('load resize', function () {

                section_height = self.$element.outerHeight();

                section_offset_top = self.$element.offset().top;
                section_offset_bottom = section_offset_top + section_height;

                animation_length = section_height + self.wh;

            });


            $(window).on('scroll resize load', function () {

                if (self.viewport_bottom > section_offset_top && self.viewport_top < section_offset_bottom) {

                    self.$element.addClass('active');

                    animation_progress_px = self.viewport_bottom - section_offset_top - (animation_length / 2);

                    animation_progress_percent = animation_progress_px / (animation_length / 2);


                    if (self.settings.animation_type == 'shift') {
                        TweenLite.to(self.$element_inner, self.settings.animate_duration, {y: self.shift * animation_progress_percent + '%'});

                    }

                    else if (self.settings.animation_type == 'rotate') {
                        TweenLite.to(self.$element_inner, self.settings.animate_duration, {rotationX: self.shift * animation_progress_percent + '%'});
                    }

                }

                else {
                    self.$element.removeClass('active');
                }

            })
        }
    }


    $.fn.parallaxBackground = function () {
        let $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i,
            ret;
        for (i = 0; i < length; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                $this[i].parallax_background = new ParallaxBackground($this[i], opt);
            else
                ret = $this[i].parallax_background[opt].apply($this[i].parallax_background, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };

})(jQuery);