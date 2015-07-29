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

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    add(particle) {
        this.particles.push(particle);
    }
    
    clear(width, height) {
        for (var i = this.particles.length - 1; i >= 0; i--) {
            if (this.particles[i].isPresent(width, height) === false) {
                this.particles.splice(i,1);
            }
        }
    }
    
    update(mouseParticle, staticMassiveParticles) {

        for(var particle of this.particles) {
        
            particle.move();

            var gravity = createVector(0, 9.81 ,0).mult(particle.mass);
            particle.add(gravity);

            mouseParticle.repusle(particle);
            for(var staticMassiveParticle of staticMassiveParticles) {
                staticMassiveParticle.repusle(particle);
            }
        }
    }
    
    draw(mouseParticle, staticMassiveParticles) {
        stroke(255);
        strokeWeight(1);
        for(var particle of this.particles) {

            ellipse(mouseParticle.x, mouseParticle.y, 100, 100);
            for(var staticMassiveParticle of staticMassiveParticles) {
                ellipse(staticMassiveParticle.x, staticMassiveParticle.y, 100, 100);
            }

            point(particle.x, particle.y);
        }
    }
}