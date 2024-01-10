import axios from "axios";
import {Observable} from "./observables";

export class Tabber {
    contructor() {
        this.current = undefined
        this.previous = undefined
    }
        setActive(value,event) {
            // console.log(value,this.current)
            if (this.current != value) {
                // console.log(this.current == value)
                if (this.current) this.current.close(event)

                this.previous = this.current
                this.current = value
                // console.log(value,this.current)
                
            }
        }

        closeActive(event) {
            if (this.current && this.current.state !== 'inactive') this.current.close(event);
        }

}

export class Modal {
    
    // basic modal class that handles open / close / toggle / methods
    // also hooks into the tabber interface to ensure only one modal of a group is open at once

    constructor(element) {

        this.element = element;

        this.openTimeLine = Observable.create(this);

        this.closeTimeLine = Observable.create(this);

        this.togglers = new Set();

        this.openers = new Set();

        this.closers = new Set();

        this.status = 'inactive';

    }

    set state({status,event}) {

        // console.log(status,this.status)
        if (status == 'inactive') this.close(event);

        else if (status == 'active') this.open(event);

        else console.log('active and inactive are the only two states needed here',status)
    
    }

    get state() {
        return this.status;
    }

    // delegates sideEffects to the onOpen observer then changes the "status"
    open(e) {
        if (!this.openTimeLine.isEmpty && this.state !== 'active') this.openTimeLine.notify(e);
        this.status = 'active'
    }

    // delegates sideEffects to the onClose observer then changes the "status"
    close(e) {
        if (!this.closeTimeLine.isEmpty && this.state !== 'inactive') this.closeTimeLine.notify(e);
        this.status = 'inactive'
    }

    // simple switch that calls open/close based on the current state of the modal
    toggle(event) {

        // console.log(this.state,this.status,this)

        if (this.state == 'inactive') this.state = {status:'active', event};

        else if (this.state == 'active') this.state = {status:'inactive', event};
        
        else console.log('err something went wrong with the modal toggler');
        
        return this;

    }

    // register DOM Element event listener that calls this toggle method
    bindToggler(...elements) {
            elements.forEach(element => {

                // console.log(element)
                if (this.togglers.has(element)) return `${element} is already bound as a toggler`
            
                this.togglers.add(element)
                element.addEventListener('click',(e) => this.toggle.call(this,e))

        });
        
        return this
    
    }

    // register DOM Element event listener that calls this open method
    bindOpener(...elements) {

        elements.forEach(element => {

            // console.log(element)
            if (this.openers.has(element)) return `${element} is already bound as a opener`
            
            this.openers.add(element)
            element.addEventListener('click',(e) => this.open.call(this,e,true))

        });

        return this

    }

    // register DOM Element event listener that calls this close method
    bindCloser(...elements) {

        elements.forEach(element => {

            // console.log(element)
            if (this.closers.has(element)) return `${element} is already bound as a closer`
            
            this.closers.add(element)
            element.addEventListener('click',(e) => this.close.call(this,e))
        
        });

        return this

    }

    // registers a common Tab Interface between modals of a group 
    bindTabber(reference) {
        
        this.Tabber = reference;
        this.openTimeLine.prioritize(() => this.Tabber.setActive(this))
        return this
    }

    onOpen(...fns) {
        this.openTimeLine.subscribe(...fns);
        return this;
    }
    onClose(...fns) {
        this.closeTimeLine.subscribe(...fns);
        return this;
    }
    
}

export class DynamicModal extends Modal {
    
    // adds functionality to handle a modals loader/suspense component
    // open/close observers will prioritize async fetching/showing data
    // comes with a render method that defines the static HTML as opposed to a basic modal with predefined HTML
    constructor( element, config = { 
        type:'lazy', 
        endpoint:undefined,
        dataHandler:undefined,
        requestHandler:undefined, 
        responseHandler:undefined,
        hydrationHandler:undefined,
    } ) {
        super(element);

        this.type = config.type || 'lazy';
        this.endpoint = config.endpoint;

        this.suspense = `<div class="loading-container"><span class="loader"></span></div>`;
        this.errRes = `<div>Error Fetching Resources</div>`

        this.handleData = config.dataHandler;
        this.handleRequest = config.requestHandler;
        this.handleResponse = config.responseHandler;
        this.handleHydration = config.hydrationHandler;
        this.ready = false
        this.pending = false
        this.hasChanged = false
        
        this.initial = true;

        this.value = ''

        // super
        this.openTimeLine.prioritize(this.checkForUpdatesToRender.bind(this))
        
        if (config.type === 'eager')
            this.update();

    }

    // set flags for next call to getData()
    setReady() {
        // console.log(`setting state to ready for ${this.element}`)
        this.pending = false;
        this.ready = true;
        if (this.initial)
            this.inital = false;
        return;
    }

    // set flags for next call to getData()
    setPending() {
        // console.log(`setting state to pending for ${this.element}`)

        this.pending = true;
        this.ready = false;
        return
    }

    async update() {
        // console.log('triggering update')
        // set flags && result/value for getData to "bounce"
        this.value = this.suspense;
        this.setPending();
        this.renderSuspense()

        // call predefined request handler callback (DOM method) with suspense HTML string
        // if (handleRequest) handleRequest(this.suspense);

        
        // fetch resources from predefined endpoint
        // console.log(this.endpoint)
        const res = await axios.get(this.endpoint)
        // console.log(res.data)
        if (res){
            // if res.ok call predifined request handler (DOM methods/tranformer) with the data and a flag
            // this.value = handleResponse('success', data)
            
            this.renderComponent(res.data)
            this.setReady();

        } else {
            // if !res.ok handle call response with an error flag 
            // this.value = handleResponse('error', data)
            
            this.renderError()
            this.setReady();
        }
        return this.value;
    }

    getData() {

        // if data is ready and hasn't changed || data is pending result will be an html string
        // return the html string
        if ( (this.ready && !this.hasChanged) || this.pending )
            return this.value
        // if not it means the data has changed or has never been fetched
        // so start the process of fetching data then return the loader

        this.update() // sets result to `<loading>` then returns a thenable
        return this.value

    }

    notifyChange() {

            if (this.type === 'lazy') {
                console.log('flagging change -- type lazy')
                this.hasChanged = true;
            }
            if (this.type === 'eager') {
                console.log('flagging change -- type eager')
                this.update();
            }

    }

    checkForUpdatesToRender() {
        console.log('checking for updates')
        if ( (this.ready && !this.hasChanged) || this.pending ){
            console.log('everything still checks out')
            return true;
        }
        if (this.hasChanged) {
            console.log('data has changed fetching changes')
            this.update();
            this.hasChanged = false;
            return false;
        }
        else if (this.initial) {
            console.log('rendering initial state')
            this.update();
            return false;
        }
    }

    
    renderSuspense() {
        this.element.innerHTML = this.suspense
    }
    renderError() {
        this.element.innerHTML = this.errRes
    }
    renderComponent(data) {
        this.element.innerHTML = this.handleData(data)
        if(this.handleHydration) {
            // console.log('hydrating component')
            this.handleHydration(this.element)
        }
    }

}