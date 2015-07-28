"use strict";

class Particle extends p5.Vector {
    constructor(x, y, z, mass) {
        super(x || 0, y || 0, z || 0);
        this.direction = createVector(random(-1,1), random(-1,1),random(-1,1));
        this.speed = random(0,1);
        this.mass = mass || 1;
    }
    move() {
        this.add(this.direction.mult(this.speed));
    }
    
    insideCircle(cicleCenterX, cicleCenterY, cicrleRadius) {
        return pow((this.x - cicleCenterX), 2) + pow((this.y - cicleCenterY), 2) <= pow(cicrleRadius/2, 2);
    }
    
    force(otherParticle, attraction) {
        attraction = attraction === false ? false : true;
        
        var force = createVector(otherParticle.x, otherParticle.y, otherParticle.z).sub(createVector(this.x, this.y, this.z));
        var distance = force.mag();
        force.normalize();
        force.mult((this.mass + otherParticle.mass)/pow(distance,2));
        if(attraction === true) force.mult(-1);

        otherParticle.add(force);
        
    }
    attract(otherParticle) {
        this.force(otherParticle, true);
    }
    repusle(otherParticle) {
        this.force(otherParticle, false);
    }
    
    isPresent(w, h) {
        return this.x <= w && this.y <= h && this.x >= 0 && this.y >= 0 ;
    }
}