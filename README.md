parallaxBackground
-------

Create captivating parallax backgrounds effortlessly with the ParallaxBackground plugin. This lightweight Vanilla JavaScript plugin, powered by GSAP animation, supports Scroll, Mouse Move, and Gyroscope events. Choose from Rotate or Shifting animations, and easily configure zoom and animation duration for a personalized touch.

Features:

- Vanilla JavaScript and GSAP powered
- Scroll, Mouse Move, Gyroscope events
- Rotate or Shifting animations
- Customizable zoom and animation duration

### Demo

[https://lemehovskiy.github.io/parallax-background](https://lemehovskiy.github.io/parallax-background)

### Package Managers

```sh
# NPM
npm install parallax_background
```

### Installation

#### Include js

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
<script src="parallaxBackground.umd.js"></script>
```

#### Set HTML

```html
<div class="parallax-background">
  <div class="parallax-inner" style="background-image: url('https://placekitten.com/1280/720')">
  </div>
</div>
```

#### Call the plugin

```html
<script type="text/javascript">
      //Initialize with jQuery
      $(document).ready(function() {
        $('.parallax-background').parallaxBackground();
      });
      //Initialize with Vanilla JavaScript
      new ParallaxBackground(document.querySelector(".parallax"));
</script>
```

#### In result

```html
<html>
  <head>
  <title>My website</title>
  </head>
  <body>

  <div class="parallax-background">
    <div class="parallax-inner" style="background-image: url('https://placekitten.com/1280/720')">
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
  //optional for jQuery initialize
  <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
  <script src="parallaxBackground.umd.js"></script>

  <script type="text/javascript">
      //Initialize with jQuery
      $(document).ready(function() {
        $('.parallax-background').parallaxBackground();
      });
      //Initialize with Vanilla JavaScript
      new ParallaxBackground(document.querySelector(".parallax"));
  </script>

  </body>
</html>
```

### Data Attribute Settings

In parallaxBackground you can add settings using the data-parallax-background attribute. You still need to call
new ParallaxBackground(selector)
to initialize parallaxBackground on the element.

Example:

```html
<div class="parallax-background" data-parallax-background='{"duration": 3, "zoom": 30}'>
  <div class="parallax-inner" style="background-image: url('background-image.jpg')">
  </div>
</div>
```

### Settings

Option | Type | Default
--- | --- | ---
events | [SCROLL, MOUSE, GYRO] | [SCROLL]
animationType | SHIFT \| ROTATE | SHIFT
zoom | int | 20
rotatePerspective | int | 1400
animateDuration | int | 1

### Browser support

* Chrome
* Firefox

### Dependencies

* GSAP animation library
