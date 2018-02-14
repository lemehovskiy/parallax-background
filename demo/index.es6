require("./sass/style.scss");

require ("jquery");

import {TweenLite, CSSPlugin} from "gsap";

require("../build/parallax_background");

require('lem_youtube');

require('video_background');


var Prism = require('prismjs');
var Normalizer = require('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');
require('prismjs/themes/prism.css');


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


    $('.parallax-demo-1').parallaxBackground();

    $('.parallax-demo-2').parallaxBackground({
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
        animate_duration: 1,
        zoom: 70,
        rotate_perspective: 1000
    });

    $('.parallax-demo-5').parallaxBackground({
        event: 'mouse_move',
        animation_type: 'rotate',
        animate_duration: 1,
        zoom: 70,
        rotate_perspective: 1000
    });

});