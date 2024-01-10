export class Slider {
    constructor( element , { onMouseUp, onMouseDown, onMouseMove }) {

        const self = this;
        this.container = element;
        this.track = element.querySelector('.slider-track');
        this.handle = element.querySelector('.slider-handle');

        this.onMouseDown = onMouseDown || null;
        this.onMouseMove = onMouseMove || null;
        this.onMouseUp = onMouseUp || null;

        this.coords = {
            get max() {
                return this.track.width - this.handleMidpoint;
            },
            get min() {
                return 0 + this.handleMidpoint;
            },
            get handleSize() {
                return this.handle.width;
            },
            get handleMidpoint() {
                return this.handleSize / 2;
            },
            get handlePosition() {
                return this.handle.x + this.handleMidpoint;
            },
            get distanceTraveled() {
                return this.handlePosition - this.trackStart;
            },
            get trackWidth() {
                return this.track.width - this.handleSize;
            },
            get trackStart() {
                return this.trackLeft + this.handleMidpoint;
            },
            get trackLeft() {
                return this.track.x;
            },
            get track() {
                return self.track.getBoundingClientRect();
            },
            get handle() {
                return self.handle.getBoundingClientRect();
            },
            clamp(val) {
                let x;
                let max = this.max;
                let min = this.min;
                if (isNaN(val))
                    throw new Error(`clamp function expects a number...you passed ${val}`);
                if (val >= max)
                    x = max;
                else if (val <= min)
                    x = min;
                else
                    x = val;

                return x;
            },
        };

        this.MAX = {
            px: this.coords.track.width,
            pct: 100,
            deg: 360,
        };

        this.MIN = {
            px: 0,
            pct: 0,
            deg: 0,
        };

        this.state = {
            px: undefined,
            deg: undefined,
            pct: undefined,
        };

        this.handle.addEventListener('mousedown', this.handleDrag.bind(this));
        this.track.addEventListener('mousedown', this.handleClick.bind(this));

    }

    update(event) {
        return this.setHandle(this.getDistanceTraveled(event));
    }

    setHandle (distanceTraveled) {
        
        let clamped = this.coords.clamp(distanceTraveled);
        this.handle.style.transform = `translateX(${clamped - this.coords.handleMidpoint}px)`;

        if (distanceTraveled <= 0)
            return this.MIN;
        if (distanceTraveled >= this.coords.track.width)
            return this.MAX;

        let distance = Math.trunc(distanceTraveled);
        let distanceInPercent = Math.trunc((distanceTraveled / this.coords.track.width) * 100);
        let distanceInDegrees = Math.trunc((distanceTraveled / this.coords.track.width) * 360);

        let values = {
            px: distance,
            pct: distanceInPercent,
            deg: distanceInDegrees,
        };

        // this.state = values;
        return values;
    }

    handleDrag(event) {

        event.stopPropagation();

        let controller = new AbortController();
        
        document.addEventListener('mousemove', (event) => {

            let state = this.update(event);
            if (this.onMouseMove) this.onMouseMove(state);

        }, { signal: controller.signal });

        document.addEventListener('mouseup', () => {   
            
            controller.abort();
            if (this.onMouseUp) this.onMouseUp();
            
        },true);

        
    }

    handleClick(event) {
        console.log('handling click')
        let state = this.update(event);
        if (this.onMouseDown) this.onMouseDown(state);
    }

    reset() {
        this.setHandle(0);
    }

    disable () {
        this.handle.removeEventListener('mousedown', this.handleDrag);
        this.track.removeEventListener('mousedown', this.handleClick);
    }

    getDistanceTraveled (event) {
        return event.clientX - this.coords.trackLeft;
    }

    convertValue (type, value) {
        
        let max = this.coords.track.width;

        if (type === 'pct') return max * (value/100);
        if (type === 'deg') return max * (value/360);
        if (type === undefined) {
            console.warn('you passed an invalid type to the sliders conver function',type,value);
            return undefined; 
        }

        console.error('something went wrong in the convert value function',type,value);
        return;
    }

    setFrom (type, value) {
        return this.setHandle(this.convertValue(type, value));
    }

    setDegrees(value) {
        return this.setFrom('deg', value);
    }

    setPercent(value) {
        return this.setFrom('pct', value);
    }

    setPixels(value) {
        return this.setHandle(value);
    }


}

export class MouseTrackingSlider {
    constructor( target, { onMouseMove, onMouseUp, onMouseDown }) {

        this.xPosInitial = null;
        this.yPosInitial = null;

        this.target = target;

        this.onMouseMove = onMouseMove;
        this.onMouseUp = onMouseUp;
        this.onMouseDown = onMouseDown;

        target.addEventListener('mousedown',this.track.bind(this))
    }

    handleDrag(event) {

        let xZeroed = event.clientX - this.xPosInitial;
        let yZeroed = event.clientY - this.yPosInitial;

        let vx = Math.floor(xZeroed / 3);
        let vy = Math.floor(yZeroed / 3);

        if ( this.onMouseMove ) this.onMouseMove({ x: Number(vx), y: Number(vy) })
    }

    track(event) {

        if (!this.xPosInitial)
            this.xPosInitial = event.pageX;
        if (!this.yPosInitial)
            this.yPosInitial = event.pageY;

        let controller = new AbortController();

        document.addEventListener( 'mousemove', this.handleDrag.bind(this) ,{ signal: controller.signal })
        document.addEventListener( 'mouseup' , () => {

            controller.abort();
        
            this.xPosInitial = null;
            this.yPosInitial = null;
        
            if ( this.onMouseUp ) this.onMouseUp();
        
        })
    }
}