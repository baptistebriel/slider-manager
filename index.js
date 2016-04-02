import Hammer from 'hammerjs'
import Hamster from 'hamsterjs'
import {on, off} from 'dom-event'

export default class Manager {
    
    constructor(opt = {}) {

        if(!opt.callback)
            console.error('You need to provide a callback function in the options')

        this.el = opt.el || document.body
        this.animating = false
        
        this.index = 0
        this.length = opt.length

        this.options = {
            loop: opt.loop || false,
            delta: opt.delta || 5,
            callback: opt.callback
        }
        
        this.hamster = new Hamster(this.el)
        this.hammer = new Hammer.Manager(this.el)
        
        this.onScroll = this.onScroll.bind(this)
        this.onSwipe = this.onSwipe.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
    }
    
    init() {
        
        this.hammer.add(new Hammer.Swipe())
        this.hammer.on('swipe', this.onSwipe)

        this.hamster.wheel(this.onScroll)

        on(document, 'keydown', this.onKeyDown)
    }

    destroy() {

        this.hammer.off('swipe', this.onSwipe)
        this.hammer.destroy()
        
        this.hamster.unwheel(this.onScroll)
        
        off(document, 'keydown', this.onKeyDown)
    }

    getNext(delta) {
        
        const next = delta >= this.options.delta ? this.index - 1 : this.index + 1 
        return next < 0 ? this.options.loop ? this.length : 0 : next > this.length ? this.options.loop ? 0 : this.length : next
    }
    
    onSwipe(e) {

        const delta = e.deltaY

        if(this.animating || delta > -this.options.delta && delta < this.options.delta) return
        this.animating = true
        
        this.callback(delta)
    }
    
    onScroll(event, delta, deltaX, deltaY) {

        if(this.animating || delta > -this.options.delta && delta < this.options.delta) return
        this.animating = true
        
        this.callback(delta)
    }
    
    onKeyDown(e) {
        
        if(this.animating || e.keyCode != '38' && e.keyCode != '40') return
        this.animating = true
        
        this.callback(e.keyCode == '38' ? this.options.delta+1 : -(this.options.delta+1))
    }

    callback(delta) {
        
        const index = this.getNext(delta)
        const event = {
            current: index,
            previous: this.index,
            direction: index >= this.index ? 'downwards' : 'upwards'
        }
        
        this.index = index
        this.options.callback(event)
    }
}