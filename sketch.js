"use strict";
var mic;
var fft;
var loop;
var particles = [];
var staticMassiveParticles = [];

function setup() {
    var myCanvas = createCanvas(windowWidth, windowHeight);
    //myCanvas.parent('myContainer');
    frameRate(30);
    
    //microphone
    mic = new p5.AudioIn();
    fft = new p5.FFT();
    mic.start();
    //mic.connect();
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
        particles.push(new Particle(randomGaussian(width/2, width/4), 0, 0, random(1, 5)));
    }
    
    push();
    for(var particle of particles) {
        
        particle.move();
        
        var gravity = createVector(0, 9.81 ,0).mult(particle.mass);
        particle.add(gravity);
        /*
        ellipse(width/2, height/2, 150, 150);
        if(particles[key].insideCircle(width/2, height/2, 150)) {
            stroke(color(255,0,0));
        } else {
            stroke(255);
        }
        */

        strokeWeight(1);
        mouseParticle.repusle(particle);
        ellipse(mouseParticle.x, mouseParticle.y, 100, 100);
        for(var staticMassiveParticle of staticMassiveParticles) {
            staticMassiveParticle.repusle(particle);
            ellipse(staticMassiveParticle.x, staticMassiveParticle.y, 100, 100);
        }
        
        point(particle.x, particle.y);
        
    }
    pop();

    for (var i = particles.length - 1; i >= 0; i--) {
      if (particles[i].isPresent(width, height) === false) {
        particles.splice(i,1);
      }
    }
        
    loop++;
}

function mouseClicked() {
    staticMassiveParticles.push(new Particle(mouseX, mouseY, 0, 100000));
}