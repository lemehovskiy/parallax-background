require("./sass/style.scss");

require ("jquery");

import {TweenLite, CSSPlugin} from "gsap";

require("../build/parallax_background");

require('lem_youtube');

require('video_background');



$(document).ready(function () {

    $(window).on('ytApiReady.ly', function () {
        $('.youtube-video').lemYoutube({
            videoId: "yu_bA7jzX5Y"
        });

        $('.youtube-video-background').videoBackground();
    });

    $('.youtube-video').on('onReady.ly', function () {
        $(this).lemYoutube('ytPlayer', 'playVideo');
        $(this).lemYoutube('ytPlayer', 'mute');
    });


    $('.parallax-demo-1').parallaxBackground({
        event: 'scroll',
        animation_type: 'shift'
    });

    $('.parallax-demo-2').parallaxBackground({
        event: 'scroll',
        animation_type: 'rotate',
        zoom: 50,
        rotate_perspective: 500

    });

    $('.parallax-demo-3').parallaxBackground({
        event: 'mouse_move',
        animation_type: 'shift',
        animate_duration: 2
    });

    $('.parallax-demo-4').parallaxBackground({
        event: 'mouse_move',
        animation_type: 'rotate',
        animate_duration: 2,
        zoom: 50
    });

    $('.parallax-demo-5').parallaxBackground({
        event: 'scroll',
        animation_type: 'shift',
        animate_duration: 1,
        zoom: 30
    });


});