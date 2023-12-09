parallaxBackground
-------

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
<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
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
    $(document).ready(function() {
      $('.parallax-background').parallaxBackground();
    });
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
  <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
  <script src="parallaxBackground.umd.js"></script>

  <script type="text/javascript">
      $(document).ready(function() {
        $('.parallax-background').parallaxBackground();
      });
  </script>

  </body>
</html>
```

### Data Attribute Settings

In parallaxBackground you can add settings using the data-parallax-background attribute. You still need to call
$(element).parallaxBackground()
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
event | SCROLL \| MOUSE | SCROLL
animationType | SHIFT \| ROTATE | SHIFT
zoom | int | 20
rotatePerspective | int | 1400
animateDuration | int | 1

### Browser support

* Chrome
* Firefox

### Dependencies

* jQuery 3.1
* Gsap
