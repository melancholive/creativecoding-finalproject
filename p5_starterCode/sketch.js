// Si Yue Jiang -- Creative Coding F22 Final Project

let p; // player character
let butterflies = [];

let counter = 0;

let forestAmbience;
let grassSoundEffect;

let bg;
let grass;
let bf; // butterfly

function preload(){
  // sound files
  forestAmbience = loadSound('forest-ambience.mp3');
  grassSoundEffect = loadSound('grass-sound-effect.mp3');

  // image files
  bg = loadImage('dark-forest.jpg');
  grass = loadImage('grass.png')
  bf = loadImage('butterfly.png');
}

function setup() {
  createCanvas(1800,900);
  forestAmbience.play();

  p = new Player();
}

function draw() {
  counter++;

  background(bg);

  // ground placeholder
  fill(0);
  stroke(255);
  strokeWeight(3);
  rect(-10, height-200, width+10,200)

  image(grass, 0, 400); // https://p5js.org/examples/image-load-and-display-image.html

  // automated butterfly spawns
  if ( counter % 100 == 0 ){
    butterflies.push(new Butterfly());
  }

  for ( let i = butterflies.length - 1; i >= 0; i-- ){
    let b = butterflies[i];
    b.drawButterfly();
    b.updateButterfly();
  }

  p.drawPlayer();
  p.updatePlayer();
}

class Player{
  constructor(){
    this.position = createVector(width/2,height-400)
  }

  drawPlayer(){
    rect(this.position.x, this.position.y-50);
  }

  updatePlayer(){

  }
}

class Butterfly{
  constructor(){
    this.position = createVector(random(0,width),random(0,height));
    this.timer = random(-20,20);
  }

  drawButterfly(){
    if ( this.timer < 100 ){
      tint(255,255-this.timer*2); // https://p5js.org/examples/image-transparency.html
      image(bf, this.position.x, this.position.y, bf.width/2, bf.height/2);
    }
  }

  updateButterfly(){
    this.timer++;
    this.position.x = this.position.x + random(-5,5);
    this.position.y = this.position.y + random(-5,5);
  }
}