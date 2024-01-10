export class Observer {
    constructor(target) {
      this.Target = target
      this.subscribers = new Set();
      this.priorities = new Set();
    }
  
    subscribe(...fns) {
      fns.forEach(fn => { 

        if (this.Target) fn = fn.bind(this.Target);

        this.subscribers.add(fn);
        
        })

      return this;
    }
  
    unsubscribe(fn) {
      this.subscribers.delete(fn);
      return this;
    }
  
    prioritize(fn) {
    if (this.Target)
        fn = fn.bind(this.Target)
      this.priorities.add(fn);
    }
  
    unprioritize(fn) {
      this.priorities.delete(fn);
    }
  
    notify(...values) {
      for (const fn of this.priorities) {
        fn(...values);
      }
      for (const fn of this.subscribers) {
        fn(...values);
      }
    }
  
    get isEmpty() {
      return this.subscribers.size === 0;
    }
  
    get hasPriorities() {
      return this.priorities.size > 0;
    }
  
}

export class Observable {
    constructor(target) {
      this.observer = new Observer(target);
    }
  
    subscribe(...fns) {
      this.observer.subscribe(...fns);
      return this;
    }
  
    unsubscribe(fn) {
      this.observer.unsubscribe(fn);
      return this;
    }
  
    prioritize(fn) {
      this.observer.prioritize(fn);
      return this;
    }
  
    unprioritize(fn) {
      this.observer.unprioritize(fn);
      return this;
    }
  
    notify(...values) {
      this.observer.notify(...values);
      return this;
    }
  
    get isEmpty() {
      return this.observer.isEmpty;
    }
  
    get hasPriorities() {
      return this.observer.hasPriorities;
    }

    get listeners() {
      return this.observer.listeners;
    }
    get priorities() {
      return this.observer.priorities;
    }

    static create(target) {
        return new Observable(target)
    }

    static observe(obj) {
        if (obj != null) {
            Object.assign(obj, 
            {
                subscribe:this.subscribe.bind(obj),
                unsubscribe:this.unsubscribe.bind(obj),
                prioritize:this.prioritize.bind(obj),
                unprioritize:this.unprioritize.bind(obj),
                notify:this.notify.bind(obj),
                subscribe:this.subscribe.bind(obj),
                get isEmpty() {
                    return this.observer.isEmpty;
                  }, 
                get hasPriorities() {
                return this.observer.hasPriorities;
                }
            })
          return obj
        }
    }
}

export class EventEmitter {
    constructor(events) {
        this.events = events || new Map();
    }
    
    on(event, listener) {

      if(!this.events.has(event)) 
          this.events.set(event, new Observable());
          
      this.events.get(event).subscribe(listener);

    }

    once(event, listener) {
      const singleton = (...args) => {
        listener(...args);
        this.off(event, singleton);
      };
      this.on(event, singleton);
    }

    off(event, listener) {

      if (!this.events.has(event))
        return

      this.events.get(event).unsubscribe(listener)

    }

    clear(event) {

      if (this.events.has(event))
        return
      
      this.events.set(event,new Observable())

    }

    emit(event,...args) {

      if(!this.events.has(event))
        return

      this.events.get(event).notify(...args)    
    }
}

export class Task {
  constructor(promiseFn) {

    this.state = undefined; // [undefined || pending || ready ]
    this.result = undefined;
    this.task = promiseFn;
    this.emitter = new EventEmitter();

  }

    async run (...args) {

      try {

        this.state = 'pending';
        this.emit('pending');
        this.result = await promiseFn.call(...args);
        this.state = 'ready';
        this.emit('ready', this.result);

      } catch (error) {

        console.error(error);
        this.state = 'error';
        this.result = error;
        this.emit('error', error);

      }

    };

    register(event, listener) {
      this.emitter.on(event, listener);
      return this
    }

    remove(event, listener) {
      this.emitter.off(event, listener);
      return this
    }

    emit (event, ...args) {
      this.emitter.emit(event, ...args);
      return this
    }

}