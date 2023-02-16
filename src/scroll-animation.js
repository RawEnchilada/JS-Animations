

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


class Subscriber{
    _animation;
    _element;

    constructor(element,animation){
        this._element = element;
        this._animation = animation;
    }


    apply(percent){
        this._animation.currentStyle(percent).applyTo(this._element);
    }

}


export class Style{
    opacity = 1;
    translateX = 0;
    translateY = 0;

    applyTo(element){
        element.style.opacity = `${this.opacity}`;
        element.style.transform = `translate(${this.translateX}px,${this.translateY}px)`;
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
 * Animation object used to define the animation of an element.
 * @example
 * let anim = new Animation();
 * anim.from(0,{opacity:0}).to(1,{opacity:1});
 */
export class Animation{
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


    currentStyle(percent){
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
        return style;
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
 * Not yet implemented
 */
export function triggerOnScroll(selector){
    return null;
}