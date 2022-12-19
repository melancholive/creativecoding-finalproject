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
let fireflies = [];
let fireflyGlows = [];


// light bar
let counter = 0;
let restart = false;
let light = 300;
let score = 0;

//sound
let forestAmbience;
let grassSoundEffect;
let bonesCrunchingEffect;

//images
let bg;
let grass;
let ff; // firefly
let endScreen;

function preload(){
  // sound files
  forestAmbience = loadSound('data/forest-ambience.mp3');
  grassSoundEffect = loadSound('data/grass-sound-effect.mp3');
  bonesCrunchingEffect = loadSound('data/bones-crunching-effect.mp3');

  // image files
  bg = loadImage('data/dark-forest.png');
  grass = loadImage('data/grass.png')
  bf = loadImage('data/butterfly.png');
  endScreen = createVideo('data/end-screen.mp4');
  endScreen.hide(); // hides the video from corner
  endScreen.loop();
  
}

function setup() {
  frameRate = 60;
  
  createCanvas(1000,800);
  forestAmbience.play();
  bonesCrunchingEffect.play();
  bonesCrunchingEffect.loop();
  bonesCrunchingEffect.setVolume(0.05);
  
  world.gravity.y = 7;
  
  // ground placeholder
  ground = new Sprite(width/2,780,width,5,'static'); // (x,  y,  w,  h, collider)
  ground.color = 'black';
  ground.visible = false;
  
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
  light -= 0.5;

  background(bg);
  
  // light bar
  fill(0);
  rect(10,10,300,20);
  fill(255);
  rect(10,10,light,20);
  
  // image(grass, 0, 400); // https://p5js.org/examples/image-load-and-display-image.html

  // automated firefly spawns
  if ( counter % 80 == 0 && light > 0 ){
    fireflies.push(new Sprite(random(0,width),random(100,height-100),20,20,'static'));
    fireflyGlows.push(new Firefly());
  }

  for ( let i = fireflies.length - 1; i >= 0; i-- ){
    let f = fireflies[i];
    f.visible = false; // makes sprites invisible
    // creates firefly glow objects that correlate with firefly sprites
    fireflyGlows[i].drawFirefly(f.x, f.y);
    fireflyGlows[i].updateFirefly();
    if ( player.overlaps(f) ){ // if a player collides with a firefly sprite, you gain more light
      f.remove();
      light += 35;
      score++;
      print(score);
      fireflyGlows[i].isCollected();
    }
  }
  
  if (light <= 0){ // END SCREEN -- when light runs out
    print('GAME OVER');
    print('PRESS ANY KEY TO CONTINUE PLAYING');
    
    fill(0);
    rect(0,0,width,height);
    
    player.visible = false;
    bonesCrunchingEffect.setVolume(1); // https://p5js.org/reference/#/p5.SoundFile/setVolume
    forestAmbience.setVolume(0.1);
    
    image(endScreen, 200, 100);
    
    for ( let i = fireflies.length - 1; i >= 0; i-- ){ // makes old sprite disappear from canvas
      let f = fireflies[i];
      f.remove();
      fireflyGlows[i].isCollected();
    }
  }
  
  if ( restart ){
    light += 300;
    score = 0;
    restart = false;
    forestAmbience.setVolume(1);
    bonesCrunchingEffect.setVolume(0.05);
  }
}

function keyPressed(){
  if ( light <= 0 ){
    restart = true;
    player.visible = true;
    bonesCrunchingEffect.stop(0);
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

class Firefly{
  constructor(){
    this.position = createVector(0,0);
    this.multiplier = 0.1;
    this.collected = false;
  }

  drawFirefly(posX,posY){
    if (this.collected == false){
      stroke(255);
      strokeWeight(0.3);
      fill(255,50);
      circle(posX, posY, 5*this.multiplier);
      circle(posX, posY, 15*this.multiplier);
      circle(posX, posY, 45*this.multiplier);
    }
  }

  updateFirefly(){
    if (this.multiplier <= 1){
      this.multiplier = this.multiplier + 0.01;
    }
  }
  
  isCollected(){
    this.collected = true;
  }
}