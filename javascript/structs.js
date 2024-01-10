export class Cursor {
    // Allows extends a basic array allowing easy access to the next and previous elements in a list 
    // according to a pointer in memory

    // EXPECTS INDEXES TO START FROM 1 INSTEAD OF ZERO
    // INDEX OF 0 == "FIRST"
    // INDEX OF length-1 = "LAST"

    // expects callers to add one when using array indexes 
constructor(array,startingIndex = 1) {
    if (!Array.isArray(array)) 
        throw new Error(`Cursor instance canceled... was expecting an array you passed ${array}`);
    else if (isNaN(startingIndex)) 
        throw new Error(`Cursor instance canceled.... expecting a number for startingIndex you passed ${startingIndex}`);

    let pointer;
    let items;
    
    if (startingIndex !== 0 && startingIndex < array.length - 1 ) this.pointer = startingIndex;
    if (array.length === 1 || array.length === 0) this.pointer = 1

    this.items = ["first",...array,"last"]

}

get first() {
    return this.items[1]
}
get last() {
    return this.items[this.items.length - 2]
}
get next() {
    return this.items[this.pointer + 1]
}
get prev() {
    return this.items[this.pointer - 1]
}
get current() {
    return this.items[this.pointer]
}
get all() {
    return this.items.filter(index => index !== 'first' && index !== 'last');
}
get size() {
    return this.items.length - 2;
}
get isEmpty() {
    return this.size === 0
}

validIndex(index) {

    if ( isNaN(index) ) 
        return NaN;
        // console.log(`\nskip function was expecting a number... you passed ${index}`)
    
    if (index > this.size || index < 0)
        return undefined;
        // console.log(`\nuh oh....index of ${index} doesn\'t exist\ntry a number from 0 to ${this.size}\n`);

    return true;

}

setPointer(index) {
    if (!this.validIndex(index)) return
    
    this.pointer = index
    return this.items[index]
}

skipToIndex(index) {
    if (!this.validIndex(index)) return

    return this.setPointer(index)
}

getIndexOf(index) {
    if (!this.validIndex(index)) return

    return this.items[index]
}

skipToNext() {
    if (this.next == "last") return this.setPointer(1)
    return this.setPointer(this.pointer + 1);
}

skipToPrev() {
    if (this.prev == "first") return this.setPointer(this.size);
    return this.setPointer(this.pointer - 1);
}

skipToLast() {
    return this.setPointer(this.size);
}

skipToFirst() {
    return this.setPointer(1);
}

pluck(index) {
    this.items = this.items.splice( index + 1 , 1 );
    return this
}

addOne(element) {
    this.items.pop();
    this.items.push(element);
    this.items.push('last');
    return this
}

addMany(elements) {
    this.items.pop();
    this.items.push(...elements)
    this.items.push('last');
    return this;
}

update( elements , startingIndex = 1) {
    let index = this.validateCursor(elements,startingIndex);
    if (index) {
        this.pointer = index;
        this.items = ["first",...elements,"last"];
    }
    return this
}

nthSuffix(num) {
    if (!isNaN(num)) {
        let n = num;
        let suff;

        if (num > 20) {
            // convert to string
            let d = num.toString()
            // grab the last digit
            n = d[d.length - 1];
        }

        n == 1 ? suff = 'st'
        : n == 2 ? suff = 'nd'
        : n == 3 ? suff = 'rd'
        : suff = 'th'

        return num.toString() + suff;
    }
    return `this function expects numbers`
}
}

export class Bucket {

    constructor() {
        this.items = new Map();
        this.identity = 'bucket';
        this.idn = 0;
    }

    get size() {
        return this.items.size;
    }
    get keys() {
        return Array.from(this.items.keys());
    }
    get values() {
        return Array.from(this.items.values());
    }
    get copies() {
        return Array.from(this.items.values()).map(structuredClone);
    }

    push( key, value ) {
        
        if (!key) return `item not pushed bucket... invalid key`;
        if (!value) return `item not pushed to bucket... invalid value`;
        if (this.items.has(key)) return `item not pushed to bucket... duplicate key`;

        this.items.set(key,value);
        return 'success';
    }

    pluck(key) {
        return this.items.delete(key);
    }

    has(key) {
        return this.items.has(key);
    }

    use(key) {
        return this.items.get(key);
    }

    useValue(key) {
        return structuredClone(this.items.get(key))
    }

    spread(map) {

        let duplicates = this.compare(map);

        if (duplicates.length > 0) {
            console.error(`${duplicates.length} duplicates found in the keyset. No items were added`,duplicates);
            return duplicates;
        }

        map.forEach((value,key) => this.push(key,value));
        return this;
    }

    compare(map) {
        return Array.from(map.keys()).filter(this.has);
    }

    wipe() {
        this.items = new Map();
    }
    
}

export default class Collection {
    
    constructor() {
        this.bucket = new Bucket();
        this.cursor = new Cursor([]);
        this.indexes = {}
    }

    get size() {
        return this.items.size;
    }

    get keys() {
        return this.bucket.keys;
    }

    get values() {
        return this.bucket.values;
    }

    get items() { 
        return this.bucket.items;
    }
    
    use(key) {
        return this.bucket.use(key)
    }

    useValue(key) {
        return this.bucket.useValue(key)
    }

    add(key,value) {
        let status = this.bucket.push(key,value)
        if (status === 'success') this.cursor.addOne(key)
        return status;
    }

    spread(map) {
        let status = this.bucket.spread(map);
        if (status) this.cursor.spread(Array.from(map.keys()))
        return status;
    }

    has(key) {
        return this.bucket.has(key);
    }

    remove(key) {
        let status = this.bucket.pluck(key);
        if (status) this.cursor.pluck(this.items.useKeys().indexOf(key));
    }

    drop() {
        this.items = new Bucket();
        this.cursor = new Cursor([]);
    }
}