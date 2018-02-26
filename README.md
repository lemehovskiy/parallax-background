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
<script src="TweenLite.min.js"></script>
<script src="CSSPlugin.min.js"></script>
<script src="jquery.min.js"></script>
<script src="parallax_background.js"></script>
```

#### Set HTML

```html
<div class="parallax-background">
  <div class="parallax-inner" style="background-image: url('background-image.jpg')">
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
    <div class="parallax-inner" style="background-image: url('background-image.jpg')">
    </div>
  </div>

  <script src="TweenLite.min.js"></script>
  <script src="CSSPlugin.min.js"></script>
  <script src="jquery.min.js"></script>
  <script src="parallax_background.js"></script>

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
event | string | scroll
animation_type | string | shift
zoom | int | 20
rotate_perspective | int | 1400
animate_duration | int | 1


### Browser support

* Chrome
* Firefox
* Opera
* IE10/11


### Dependencies

* jQuery 1.7
* Gsap
