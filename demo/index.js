import Manager from '../index.js'

const slides = document.querySelectorAll('div')

const slider = new Manager({
  length: slides.length - 1,
  loop: true,
  direction: 'y',
  limitInertia: true,
  callback: (e) => {

    console.log(e)
    slider.animating = true

    slides.forEach((slide, i) => {

      slide.addEventListener('transitionend', () => {
        slider.animating = false
      })

      slide.style.transform = i === e.current ? 'none' : i > e.current ? 'translateY(100%)' : 'translateY(-100%)'
    })
  }
})

slider.init()
