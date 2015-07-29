"use strict";
var mic;
var fft;
var loop;
var particleSystem;
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
    particleSystem = new ParticleSystem();
}

function draw() { 
    fill(color(0, 0, 26, 255));
    rect(0,0, width, height);
    noFill();
    
    stroke(255,255,255, 100);
    strokeWeight(1);
    text(particleSystem.particles.length, 10,10);
    
    var waveform = fft.analyze();
    noFill();
    beginShape();
    for (var i = 0; i< waveform.length; i++){
        var x = map(i, 0, waveform.length, 0, width);
        var y = height - map( waveform[i], 0, 255, 0, height/2);
        vertex(x,y);
    }
    endShape();

    var mouseParticle = new Particle(mouseX, mouseY, 0, 100000);
    
    for(var i = 0; i < 10; i++) {
        var p = new Particle(randomGaussian(width/2, width/4), 0, 0, random(1, 5))
        particleSystem.add(p);
    }
    
    particleSystem.update(mouseParticle, staticMassiveParticles);
    particleSystem.draw(mouseParticle, staticMassiveParticles);
    particleSystem.clear(width, height);
}

function mouseClicked() {
    staticMassiveParticles.push(new Particle(mouseX, mouseY, 0, 100000));
}