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
        strokeWeight(4);
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
import ddf.minim.*;

Minim minim;
AudioInput  accessMic;
float micLevel;

ParticleSystem particleSystem;
ArrayList<Particle> staticMassiveParticles;

boolean DEBUG = false;

void setup() {
  size(640, 360, P3D);

  staticMassiveParticles = new ArrayList<Particle>();
  frameRate(30);

  minim = new Minim(this);
  accessMic = minim.getLineIn();
  micLevel = accessMic.mix.level();
  
  particleSystem = new ParticleSystem();
  micLevel = 0;
}

void draw() {
    stroke(255,255,255, 100);
    strokeWeight(0);
    fill(color(0, 0, 26, 255));
    rect(0,0, width, height);
    fill(255);


    micLevel = accessMic.mix.level();

    if (DEBUG) text(particleSystem.particles.size(), 10,10);
    if (DEBUG) rect(0, height, 3, -map(micLevel, 0, 1, 0, height));
    if (DEBUG) {
       for(int i = 0; i < accessMic.bufferSize() - 1; i++)
        {
          line( i, height/2 + accessMic.mix.get(i)*50, i+1, height/2 + accessMic.left.get(i+1)*50 );
        }
    }

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


