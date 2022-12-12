// Si Yue Jiang -- Creative Coding F22 Final Project

/*
REFERENCES:
Images: https://p5js.org/reference/#/p5/image
Sound: https://p5js.org/reference/#/libraries/p5.sound
Play Library: https://p5play.org/docs/classes/Sprite.html
*/

// sprites
let player;
let ground;
let leftBorder;
let rightBorder;
let ceiling;
let butterflies = [];

// light bar
let counter = 0;
let restart = false;
let light = 300;

//sound
let forestAmbience;
let grassSoundEffect;

//images
let bg;
let grass;
let bf; // butterfly

function preload(){
  // sound files
  forestAmbience = loadSound('forest-ambience.mp3');
  grassSoundEffect = loadSound('grass-sound-effect.mp3');

  // image files
  bg = loadImage('dark-forest.jpg'); // replace later
  grass = loadImage('grass.png')
  bf = loadImage('butterfly.png');
}

function setup() {
  frameRate = 60;
  
  createCanvas(1000,800);
  forestAmbience.play();
  
  world.gravity.y = 7;
  
  // ground placeholder
  ground = new Sprite(width/2,780,width,5,'static'); // (x,  y,  w,  h, collider)
  ground.color = 'white';
  
  // world borders
  leftBorder = new Sprite(-5,0,5,height*2,'static');
  rightBorder = new Sprite(width+5,0,5,height*2,'static');
  ceiling = new Sprite(0,-5,width*2,5,'static');

  // player character
  player = new Sprite(width/2,700,40,40); // (x,  y,  w,  h)
  
  if ( player.colliding(ground) ){
    player.velocity.y = -5;
  }
  
}

function draw() {
  counter++;
  light--;

  background(bg);
  
  // light bar
  fill(0);
  rect(10,10,300,20);
  fill(255);
  rect(10,10,light,20);
  
  if (light <= 0){
    print('GAME OVER');
    print('PRESS SPACE TO CONTINUE PLAYING');
    rect(0,0,width,height);
  }
  
  if ( restart ){
    light += 300;
    restart = false;
  }

  // image(grass, 0, 400); // https://p5js.org/examples/image-load-and-display-image.html

  /*
  // automated butterfly spawns
  if ( counter % 200 == 0 ){
    butterflies.push(new Butterfly());
  }

  for ( let i = butterflies.length - 1; i >= 0; i-- ){
    let b = butterflies[i];
    b.drawButterfly();
    b.updateButterfly();
  }
  */
}

function keyPressed(){
  if ( light <= 0 ){
    restart = true;
  }
  
  if ( kb.pressing('left') ){
    player.move(800,'left',7);
  }
  if ( kb.pressing('right') ){
    player.move(800,'right',7);
  }
  if ( kb.presses('up') ){
    player.move(200,'up',7);    
  }
}

class Butterfly{
  constructor(){
    this.position = createVector(random(0,width),random(0,height));
    this.timer = random(-20,20);
  }

  drawButterfly(){
    if ( this.timer < 200 ){
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