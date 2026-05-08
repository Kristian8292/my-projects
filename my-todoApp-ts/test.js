// OOP
// Object Oriented Programming

class Animal {
    constructor (lifespan, eatingHabits) {
        this.lifespan = lifespan;
        this.eatingHabits = eatingHabits;
    }

    eat () {
        if (this.eatingHabits == 'carnivore') {
            console.log('just ate meat');
        }
        
        if (this.eatingHabits == 'herbivore') { 
            console.log('just ate grass');
        }

        if (!this.eatingHabits) {
            console.error('this animal does not have eating habits');
        }
    }

    sleep () {

    }

    size;
}

class Bird extends Animal {
    constructor (lifespan, eatingHabits){
        super(lifespan, eatingHabits);
    }

    fly () {

    }
}

class Eagle extends Bird {
    constructor (lifespan) {
        super(lifespan, "carnivore");
    }
}

let myEagle = new Eagle(20);
console.log(myEagle);
myEagle.eat();

let today = Object.keys();