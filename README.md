parallaxBackground
-------

### Demo

[https://lemehovskiy.github.io/parallax_background/demo](https://lemehovskiy.github.io/parallax_background/demo/)


### Package Managers

```sh
# NPM
npm install parallax_background
```


### Settings

Option | Type | Default
--- | --- | ---
event | string | scroll
animation_type | string | shift
zoom | int | 20
rotate_perspective | int | 1400
animate_duration | int | 1

Example:

```html

<section class="parallax-demo-1">
    <div class="parallax-inner"
         style="background-image: url('image.jpg')">
    </div>
</section>

<script>
    $('.parallax-demo-1').parallaxBackground({
        event: 'scroll',
        animation_type: 'shift'
    });
</script>
```

### Browser support

* Chrome
* Firefox
* Opera
* IE10/11


### Dependencies

* jQuery 1.7
* Gsap
