

class Publisher{
    _subscribers = [];
    _requestId = null;

    get scrollY(){return window.scrollY;};
    get maxY(){return document.body.scrollHeight - window.innerHeight;};
    get percent(){return this.scrollY/this.maxY;};


    subscribe(subscriber){
        if(this._subscribers.length === 0){
            this._requestId = window.requestAnimationFrame(this.onPaint);
            document.styleSheets[0].insertRule(`html,body{scroll-behavior:smooth;}`,0);
        }
        this._subscribers.push(subscriber);
        subscriber._element.addEventListener('beforeunload',()=>this.unsubscribe(subscriber));
    }


    unsubscribe(subscriber){
        this._subscribers = this._subscribers.filter(s=>s!==subscriber);
        if(this._subscribers.length === 0){
            window.cancelAnimationFrame(this._requestId);
        }
    }

    onPaint(timestamp){
        for(let s of scroll_publisher._subscribers){
            s.apply(scroll_publisher.percent);
        }
        scroll_publisher._requestId = window.requestAnimationFrame(scroll_publisher.onPaint);
    }

}

class IScrollListener{
    listen(percent,element){};
}

class Subscriber{
    _animation;
    _element;

    constructor(element,animation){
        this._element = element;
        this._animation = animation;
    }


    apply(percent){
        this._animation.listen(percent,this._element);
    }

}


export class Style{
    opacity = 1;
    translateX = 0;
    translateY = 0;
    scaleX = 1;
    scaleY = 1;

    applyTo(element){
        element.style.opacity = `${this.opacity}`;
        element.style.transform = `translate(${this.translateX}px,${this.translateY}px)`;
        element.style.transform = `scale(${this.scaleX},${this.scaleY})`;
    }
}

export class Options{
    easing = 'linear';
}

const interpolations = {
    linear(percent,from,to){
        return from + (to - from) * percent;
    },
    easeIn(percent,from,to){
        return from + (to - from) * Math.pow(percent,2);
    },
    easeOut(percent,from,to){
        return from + (to - from) * (1 - Math.pow(1-percent,2));
    },
    easeInOut(percent,from,to){
        return from + (to - from) * (percent < 0.5 ? 2 * Math.pow(percent,2) : 1 - Math.pow(-2 * percent + 2,2) / 2);
    }
}
function interpolate(percent,from,to,easing){
    return interpolations[easing](percent,from,to);
}

/**
 * @class
 * @description
 * Trigger object used to apply effects on an element at a specific scroll position.
 * @example
 * let trigger = new Trigger();
 * trigger.after(0.5).applyClass('my-class');
 */
export class Trigger extends IScrollListener{
    _applyClasses = [];
    _removeClasses = [];
    _after = null;
    _before = null;

    /**
     * @memberof Trigger
     * @param {Number} percent
     * @returns {Trigger} this
     * @description
     * Set the scroll position after which the trigger will be applied.
     */
    after(percent){
        this._after = percent;
        return this;
    }

    /**
     * @memberof Trigger
     * @param {Number} percent
     * @returns {Trigger} this
     * @description
     * Set the scroll position before which the trigger will be applied.
     */
    before(percent){
        this._before = percent;
        return this;
    }

    /**
     * @memberof Trigger
     * @param {String} className
     * @returns {Trigger} this
     */
    applyClass(className){
        this._applyClasses.push(className);
        return this;
    }

    /**
     * @memberof Trigger
     * @param {String} className
     * @returns {Trigger} this
     */
    removeClass(className){
        this._removeClasses.push(className);
        return this;
    }

    listen(percent,element){
        if(this._after != null && percent >= this._after){
            for(let c of this._applyClasses){
                element.classList.add(c);
            }
            for(let c of this._removeClasses){
                element.classList.remove(c);
            }
            this._after = null;
        }
        if(this._before != null && percent <= this._before){
            for(let c of this._applyClasses){
                element.classList.remove(c);
            }
            for(let c of this._removeClasses){
                element.classList.add(c);
            }
            this._before = null;
        }
    }

}

/**
 * @class
 * @description
 * Animation object used to define the animation of an element.
 * @example
 * let anim = new Animation();
 * anim.from(0,{opacity:0}).to(1,{opacity:1});
 */
export class Animation extends IScrollListener{
    _min = 0;
    _max = 1;
    _from = null;
    _to = null;
    _options = new Options();

    _volatiles = [];

    /**
     * @memberof Animation
     * @param {Number} percent 
     * @param {Style} style 
     * @param {Number} style.opacity
     * @param {Number} style.translateX
     * @param {Number} style.translateY
     * @param {Number} style.scaleX
     * @param {Number} style.scaleY
     * @returns {Animation} this
     */
    from(percent,style){
        this._min = percent;
        this._from = this._toStyle(style);
        return this;
    }

    /**
     * @memberof Animation
     * @param {Number} percent 
     * @param {Style} style 
     * @param {Number} style.opacity
     * @param {Number} style.translateX
     * @param {Number} style.translateY
     * @param {Number} style.scaleX
     * @param {Number} style.scaleY
     * @returns {Animation} this
     */
    to(percent,style){
        this._max = percent;
        this._to = this._toStyle(style);
        return this;
    }

    /**
     * @memberof Animation
     * @param {Options} options 
     * @param {String} options.easing - "linear" | "easeIn" | "easeOut" | "easeInOut"
     * @returns {Animation} this
     */
    using(options){
        this._options = options;
        return this;
    }
    
    _toStyle(obj){
        let style = new Style();
        for(let key in obj){
            if(style.hasOwnProperty(key)){
                this._volatiles.push(key);
                style[key] = obj[key];
            }
            else{
                console.error(`Scroll animations has no support for the property: '${key}' or it's not a valid property.`);
            }
        }
        return style;
    }


    listen(percent,element){
        let style = new Style();
        let relative_percent = (percent - this._min) / (this._max - this._min);
        if(percent < this._min){
            relative_percent = 0;
        }
        else if(percent > this._max){
            relative_percent = 1;
        }
        for(let key of this._volatiles){
            style[key] = interpolate(relative_percent,this._from[key],this._to[key],this._options.easing);
        }
        style.applyTo(element);
    }

}

var scroll_publisher = new Publisher();

/**
 * @description
 * Registers selected element(s) to be updated on scroll using the returned animation object.
 * @param {String} selector
 * @returns {Animation} animation
 * @example
 * updateOnScroll('#my-element').from(0,{opacity:0}).to(1,{opacity:1});
 */
export function updateOnScroll(selector){
    let elements = document.querySelectorAll(selector);
    if(elements.length === 0){
        console.error(`Scroll animations could not find any element with the selector: '${selector}'`);
        return null;
    }
    let anim = new Animation();
    for(let e of elements){
        let s = new Subscriber(e,anim);
        scroll_publisher.subscribe(s);
    }
    return anim;
}

/**
 * @description
 * Registers selected element(s) to be updated on a specific scroll position using the returned trigger object.
 * @param {String} selector 
 * @returns {Trigger} trigger
 * @example
 * triggerOnScroll('#my-element').at(0.5).applyClass('my-class');
 */
export function triggerOnScroll(selector){
    let elements = document.querySelectorAll(selector);
    if(elements.length === 0){
        console.error(`Scroll animations could not find any element with the selector: '${selector}'`);
        return null;
    }
    let trigger = new Trigger();
    for(let e of elements){
        let s = new Subscriber(e,trigger);
        scroll_publisher.subscribe(s);
    }
    return trigger;
}