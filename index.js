import vs from 'virtual-scroll'
import sniffer from 'sniffer'
import { on, off } from 'dom-event'

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
            callback: opt.callback,
            limitInertia: opt.limitInertia || false
        }

        this.vs = null
        
        this.onScroll = this.onScroll.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
    }
    
    init() {
        
        this.vs = new vs({ limitInertia: this.options.limitInertia })
        this.vs.on(this.onScroll)
        
        if(sniffer.isDesktop) {
            on(document, 'keydown', this.onKeyDown)
        }
    }
    
    destroy() {
        
        this.vs.off(this.onScroll)
        this.vs.destroy()
        this.vs = null
        
        if(sniffer.isDesktop) {
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

        const prev = this.options.direction == 'y' ? 'up' : 'left'
        const next = this.options.direction == 'y' ? 'down' : 'right'
        
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
    
    onScroll(event) {
      
        const { deltaX, deltaY } = event
        const norm = this.options.direction == 'y' ? deltaY - (deltaY * 2) : deltaX - (deltaX * 2)
        
        if(this.animating || norm > -this.options.delta && norm < this.options.delta) return
        this.animating = true
        
        this.callback(norm)
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