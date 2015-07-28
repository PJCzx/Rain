"use strict";
var mic;
var fft;
var loop;
var particles = {};
var staticMassiveParticles = [];

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
}

function setup() {
    var myCanvas = createCanvas(windowWidth, windowHeight);
    //myCanvas.parent('myContainer');
    frameRate(30);
    
    //microphone
    mic = new p5.AudioIn();
    fft = new p5.FFT();
    mic.start();
    mic.connect();
    loop = 0;
}

function draw() { 
    var mouseParticle = new Particle(mouseX, mouseY, 0, 100000);
    fill(color(0, 0, 26, 255));
    rect(0,0, width, height);
    noFill();
    
    stroke(255,255,255, 100);
    strokeWeight(1);
    
    var waveform = fft.analyze();
    noFill();
    beginShape();

    for (var i = 0; i< waveform.length; i++){
        var x = map(i, 0, waveform.length, 0, width);
        var y = height - map( waveform[i], 0, 255, 0, height/2);
        vertex(x,y);
    }
    endShape();
    
    stroke(255);
    
    for(var i= 0; i < 10; i++) {
        particles[loop*100+i] = new Particle(randomGaussian(width/2, width/4), 0, 0, random(1, 5));
    }
    
    var candidateForDeletion = [];
    push();
    for(var key in particles) {
        
        particles[key].move();
        
        var gravity = createVector(0, 9.81 ,0).mult(particles[key].mass);
        particles[key].add(gravity);
        /*
        ellipse(width/2, height/2, 150, 150);
        if(particles[key].insideCircle(width/2, height/2, 150)) {
            stroke(color(255,0,0));
        } else {
            stroke(255);
        }
        */
        
        if( particles[key].x > width) candidateForDeletion.push(key);
        if( particles[key].y > height) candidateForDeletion.push(key);
        if( particles[key].x < 0 || particles[key].y < 0) candidateForDeletion.push(key);

        strokeWeight(1);
        mouseParticle.repusle(particles[key]);
        ellipse(mouseParticle.x, mouseParticle.y, 100, 100);
        for(var staticMassiveParticle of staticMassiveParticles) {
            staticMassiveParticle.repusle(particles[key]);
            ellipse(staticMassiveParticle.x, staticMassiveParticle.y, 100, 100);
        }
        
        point(particles[key].x, particles[key].y);
        
    }
    pop();

    for(var candidate of candidateForDeletion) {
        delete particles[candidate];
    }
        
    loop++;
}

function mouseClicked() {
    staticMassiveParticles.push(new Particle(mouseX, mouseY, 0, 100000));
}