import Hammer from 'hammerjs'
import Hamster from 'hamsterjs'
import sniffer from 'sniffer'
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
            direction: opt.direction || 'y',
            loop: opt.loop || false,
            delta: opt.delta || 1,
            callback: opt.callback
        }

        this.hamster = null
        this.hammer = null
        
        this.onScroll = this.onScroll.bind(this)
        this.onSwipe = this.onSwipe.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
    }
    
    init() {
        
        if(sniffer.isDevice) {
            this.hammer = new Hammer.Manager(this.el)
            this.hammer.add(new Hammer.Swipe())
            this.hammer.on('swipe', this.onSwipe)
        }
        
        if(sniffer.isDesktop) {
            this.hamster = new Hamster(this.el)
            this.hamster.wheel(this.onScroll)
            on(document, 'keydown', this.onKeyDown)
        }
    }
    
    destroy() {
        
        if(sniffer.isDevice) {
            this.hammer.off('swipe', this.onSwipe)
            this.hammer.destroy()
            this.hammer = null
        }
        
        if(sniffer.isDesktop) {
            this.hamster.unwheel(this.onScroll)
            this.hamster = null
            off(document, 'keydown', this.onKeyDown)
        }
    }
    
    getNext(delta) {
        
        const next = delta >= this.options.delta ? this.index + 1 : this.index - 1 
        
        return this.checkLoop(next)
    }
    
    checkLoop(next) {

        return next < 0 ? this.options.loop ? this.length : 0 : next > this.length ? this.options.loop ? 0 : this.length : next
    }
    
    getEvent(index) {

        const prev = this.options.direction == 'y' ? 'down' : 'left'
        const next = this.options.direction == 'y' ? 'up' : 'right'
        
        let direction = index > this.index ? next : prev
        if (this.options.loop) {
            if (this.index == 0 && index == this.length) direction = prev
            if (this.index == this.length && index == 0) direction = next
        }
        
        return {
            current: index,
            previous: this.index,
            direction: direction
        }
    }
    
    onSwipe(e) {

        const norm = this.options.direction == 'y' ? e.deltaY : e.deltaX

        if(this.animating || norm > -this.options.delta && norm < this.options.delta) return
        this.animating = true
        
        this.callback(norm - (norm * 2))
    }
    
    onScroll(event, delta, deltaX, deltaY) {
        
        const norm = this.options.direction == 'y' ? deltaY : deltaX

        if(this.animating || norm > -this.options.delta && norm < this.options.delta) return
        this.animating = true
        
        this.callback(norm - (norm * 2))
    }
    
    onKeyDown(e) {

        const prev = this.options.direction == 'y' ? '38' : '37'
        const next = this.options.direction == 'y' ? '40' : '39'
        
        if(this.animating || e.keyCode != prev && e.keyCode != next) return
        this.animating = true
        
        this.callback(e.keyCode == next ? this.options.delta+1 : -(this.options.delta+1))
    }
    
    goTo(index) {

        const check = this.checkLoop(index)
        const event = this.getEvent(check)
        
        this.index = check
        this.options.callback(event)
    }

    callback(delta) {
        
        const index = this.getNext(delta)
        const event = this.getEvent(index)
        
        this.index = index
        this.options.callback(event)
    }
}