# slider-manager

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

## Usage

[![NPM](https://nodei.co/npm/slider-manager.png)](https://www.npmjs.com/package/slider-manager)

`npm install slider-manager --save`

```javascript
import Manager from 'slider-manager'
import gsap from 'gsap'

const slides = [].slice.call(document.querySelectorAll('.slides'))

const slider = new Manager({
    length: slides.length,
    loop: true,
    callback: (event) => {
        
        const index = event.current
        const previous = event.previous
        const down = event.direction === 'downwards'

        slider.animating = true

        this.videos[index].play()

        const windowheight = window.innerHeight
        const tl = new TimelineMax({ paused: true, onComplete: () => {

            this.videos[previous].pause()
            slider.animating = false
        }})

        tl.staggerTo(slides, 1, { cycle: {
            y: (loop) => index === loop ? 0 : loop < index ? -windowheight : windowheight
        }, ease: Expo.easeInOut}, 0, 0)

        tl.restart()
    }
})

slider.init()
```

### options

- `el`: HTMLElement to listen for scroll/touch events - defaults to document.body
- `direction`: 'x' or 'y' - defaults to 'y'
- `loop`: true of false - defaults to false
- `delta`: delta limiter for scroll/touch events - defaults to 1
- `limitInertia`: if set to true, leverage the limitInertia option of [virtual-scroll](https://github.com/ayamflow/virtual-scroll) to distinguish between user-initiated and inertial scrolling. Prevents callback from firing multiple times per scroll - defaults to false.
- `callback`: function called when user has swiped or scrolled

### methods

- `init`: add event listeners
- `goTo(index)`: goes to the slide index
- `destroy`: remove event listeners

### changelog

- `1.0.6`: added direction to options, so it listens to either deltaX or deltaY depending on the desired option
- `1.1.6`: added limitInertia to options, that when set to true fixes a behavior where multiple callbacks are fired for a single user-initiated scroll due to inertial scrolling.

## License

MIT, see [LICENSE.md](http://github.com/BaptisteBriel/slider-manager/blob/master/LICENSE.md) for details.
