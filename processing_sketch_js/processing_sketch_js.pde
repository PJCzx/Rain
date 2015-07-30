public class Particle extends PVector {
    PVector direction;
    float mass;
    
    public Particle (float x, float y, int z, float mass) {
        super(x, y, z);
        this.direction = new PVector(random(-1,1), random(-1,1), random(-1,1));
        this.mass = mass;
    }
    public void move() {
         this.add(this.direction);
    }
    
    public boolean insideCircle(float cicleCenterX, float cicleCenterY, float cicrleRadius) {
        return pow((this.x - cicleCenterX), 2) + pow((this.y - cicleCenterY), 2) <= pow(cicrleRadius/2, 2);
    }
    
    public void force(Particle otherParticle, boolean attraction) {        
        PVector force = new PVector(otherParticle.x, otherParticle.y, otherParticle.z);
        force.sub(this.x, this.y, this.z);
        float distance = force.mag();
        force.normalize();
        force.mult((this.mass + otherParticle.mass)/pow(distance,2));
        if(attraction == true) force.mult(-1);

        otherParticle.add(force);
        
    }
    public void attract(Particle otherParticle) {
        this.force(otherParticle, true);
    }
    public void repusle(Particle otherParticle) {
        this.force(otherParticle, false);
    }
    
    public boolean isPresent(float w, float h) {
        return this.x <= w && this.y <= h && this.x >= 0 && this.y >= 0 ;
    }
}

class ParticleSystem {
    ArrayList<Particle> particles;

    public ParticleSystem() {
        particles = new ArrayList<Particle>();
    }

    public void add(Particle particle) {
        this.particles.add(particle);
    }
    
    public void clear(float width, float height) {
        for (int i = this.particles.size() - 1; i >= 0; i--) {
            if (this.particles.get(i).isPresent(width, height) == false) {
                this.particles.remove(i);
            }
        }
    }
    
    public void update(Particle mouseParticle, ArrayList<Particle> staticMassiveParticles) {

        for(Particle particle : this.particles) {
        
            particle.move();

            PVector gravity = new PVector(0, 9.81 ,0);
            gravity.mult(particle.mass);
            particle.add(gravity);

            mouseParticle.repusle(particle);
            for(Particle staticMassiveParticle : staticMassiveParticles) {
                staticMassiveParticle.repusle(particle);
            }
        }
    }
    
    public void draw(Particle mouseParticle, ArrayList<Particle> staticMassiveParticles) {
        stroke(255);
        strokeWeight(1);
        noFill();
        for(Particle particle : this.particles) {

            ellipse(mouseParticle.x, mouseParticle.y, 100, 100);
            for(Particle staticMassiveParticle : staticMassiveParticles) {
                ellipse(staticMassiveParticle.x, staticMassiveParticle.y, 100, 100);
            }

            point(particle.x, particle.y);
        }
    }
}
public void mouseClicked() {
    staticMassiveParticles.add(new Particle(mouseX, mouseY, 0, 100000));
}



//------------------------------------------------------------------------------------------
import ddf.minim.spi.*;
import ddf.minim.signals.*;
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.ugens.*;
import ddf.minim.effects.*;

Minim       minim;
AudioInput  accessMic;
FFT         fft;


//var mic;
float micLevel;
int loop;
ParticleSystem particleSystem;
ArrayList<Particle> staticMassiveParticles;
boolean DEBUG = false;

void setup() {
  size(640, 360, P3D);
  background(255);
  staticMassiveParticles = new ArrayList<Particle>();
  frameRate(30);
    
  //microphone
  //mic = new p5.AudioIn();
  //fft = new p5.FFT();
  //mic.start();
  //mic.connect();
  minim = new Minim(this);
  accessMic = minim.getLineIn();
  micLevel = accessMic.mix.level();
  
  loop = 0;
  particleSystem = new ParticleSystem();
  micLevel = 0;
}

void draw() {
    fill(color(0, 0, 26, 255));
    rect(0,0, width, height);
    fill(255);
    //micLevel = mic.getLevel();
    micLevel = accessMic.mix.level();

    stroke(255,255,255, 100);
    strokeWeight(1);
    if (DEBUG) text(particleSystem.particles.size(), 10,10);
    if (DEBUG) rect(0, height, 3, -map(micLevel, 0, 1, 0, height));
    if (DEBUG) {
       for(int i = 0; i < accessMic.bufferSize() - 1; i++)
        {
          line( i, height/2 + accessMic.mix.get(i)*50, i+1, height/2 + accessMic.left.get(i+1)*50 );
        }
    }
    
    /*
    var waveform = fft.analyze();
    noFill();
    if (DEBUG) {
        beginShape();
        for (var i = 0; i< waveform.length; i++){
            var x = map(i, 0, waveform.length, 0, width);
            var y = height - map( waveform[i], 0, 255, 0, height/2);
            vertex(x,y);
        }
        endShape();
    }*/

    Particle mouseParticle = new Particle(mouseX, mouseY, 0, 100000+ 10000000*micLevel);
    
    for(int i = 0; i < 30; i++) {
        Particle p = new Particle(width/2 + (randomGaussian() * width/6), 0, 0, random(1, 5));
        particleSystem.add(p);
    }
    
    particleSystem.update(mouseParticle, staticMassiveParticles);
    particleSystem.draw(mouseParticle, staticMassiveParticles);
    particleSystem.clear(width, height);

  
}


void stop()
{
  accessMic.close();
  minim.stop();
 
  super.stop();
}


