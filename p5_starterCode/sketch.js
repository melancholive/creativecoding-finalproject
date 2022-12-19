// Si Yue Jiang -- Creative Coding F22 Final Project

/*
REFERENCES:
Images: https://p5js.org/reference/#/p5/image
Sound: https://p5js.org/reference/#/libraries/p5.sound
Play Library: https://p5play.org/docs/classes/Sprite.html
*/

// sprites
let player;
let direction = true;
let ground;
let leftBorder;
let rightBorder;
let ceiling;
let fireflies = [];
let fireflyGlows = [];
let monsters = [];

// light bar
let counter = 0;
let restart = false;
let light = 300;
let score = 0;

//sound
let forestAmbience;
let grassSoundEffect;
let bonesCrunchingEffect;
let monsterGrowlingEffect;

//images
let bg;
let ff; // firefly
let endScreen;
let spriteRight;
let spriteLeft;
let vignette;
let leftWalkingMonster;
let rightWalkingMonster;

function preload(){
  // sound files
  forestAmbience = loadSound('data/forest-ambience.mp3');
  grassSoundEffect = loadSound('data/grass-sound-effect.mp3');
  bonesCrunchingEffect = loadSound('data/bones-crunching-effect.mp3');
  monsterGrowlingEffect = loadSound('data/monster-growling-effect.mp3');

  // image files
  bg = loadImage('data/dark-forest.png');
  grass = loadImage('data/grass.png')
  bf = loadImage('data/butterfly.png');
  endScreen = createVideo('data/end-screen.mp4');
  endScreen.hide(); // hides the video from corner
  endScreen.loop();
  spriteRight = loadImage('data/sprite-right.png');
  spriteLeft = loadImage('data/sprite-left.png');
  vignette = loadImage('data/vignette.png');
  leftWalkingMonster = loadImage('data/left-walking-monster.png');
  rightWalkingMonster = loadImage('data/right-walking-monster.png');
}

function setup() {
  frameRate = 60;
  
  createCanvas(1000,800);
  forestAmbience.play();
  bonesCrunchingEffect.setVolume(0.05);
  bonesCrunchingEffect.rate(3); // https://p5js.org/reference/#/p5.SoundFile/rate
  bonesCrunchingEffect.play();
  bonesCrunchingEffect.loop();
  monsterGrowlingEffect.setVolume(0.05);
  monsterGrowlingEffect.play();
  monsterGrowlingEffect.loop();
  
  world.gravity.y = 7;
  
  // ground placeholder
  ground = new Sprite(width/2,780,width,5,'static'); // (x,  y,  w,  h, collider)
  ground.color = 'black';
  ground.visible = false;
  
  // world borders
  leftBorder = new Sprite(-5,0,5,height*2,'static');
  rightBorder = new Sprite(width+5,0,5,height*2,'static');
  ceiling = new Sprite(0,-5,width*2,5,'static');
  vignette.resize(width,height);

  // player character
  player = new Sprite(width/2,700,60,60); // (x,  y,  w,  h)
  player.visible = false;
  spriteRight.resize(60,0);
  spriteLeft.resize(60,0);
  
  if ( player.colliding(ground) ){
    player.velocity.y = -5;
  }
  
}

function draw() {
  counter++;
  light -= 0.5;

  background(bg);
  monsterGrowlingEffect.setVolume(1-light/300); // growling sounds get louder as the player gets closer to death
  fill(0,255-255*light/300); // screen gets darker as you run out of light
  rect(0,0,width,height);
  
  if ( direction ){ // true = right, false = left
    image(spriteRight,player.x-30,player.y-35);
  } else {
    image(spriteLeft,player.x-30,player.y-35);
  }
  
  // light bar
  fill(0);
  rect(10,10,300,20);
  fill(255);
  rect(10,10,light,20);
  
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
      light += 40;
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
    monsterGrowlingEffect.setVolume(0.05);
    forestAmbience.setVolume(0.1);
    bonesCrunchingEffect.setVolume(1); // https://p5js.org/reference/#/p5.SoundFile/setVolume
    
    image(endScreen, 180, 200);
    fill(255,0,0,100);
    rect(0,0,width,height);
    
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
  
  image(vignette,0,0);
  fill(255,10);
  rect(10,10,light,20);
}

function keyPressed(){
  if ( light <= 0 ){
    restart = true;
    player.visible = true;
    bonesCrunchingEffect.stop(0);
  }
  
  if ( kb.pressing('left') ){
    player.move(800,'left',7);
    direction = false;
  }
  if ( kb.pressing('right') ){
    player.move(800,'right',7);
    direction = true;
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
    this.increase = true;
  }

  drawFirefly(posX,posY){
    if (this.collected == false){ // draws the firefly as long as it hasn't been collected
      stroke(255);
      strokeWeight(0.3);
      fill(255,50);
      circle(posX, posY, 5*this.multiplier);
      circle(posX, posY, 15*this.multiplier);
      circle(posX, posY, 45*this.multiplier);
    }
  }

  updateFirefly(){ // adjusts size of glow so it pulses
    if (this.multiplier < 1 && this.increase){
      this.multiplier += 0.01;
    } else if (this.multiplier == 1){
      this.multiplier -= 0.01;
      this.increase = false;
    } else if (this.multiplier > 0.1 && this.increase == false ){
      this.multiplier -= 0.01;
    } else if (this.multiplier == 0 ){
      this.multiplier += 0.01;
      this.increase = true;
    }
  }
  
  isCollected(){
    this.collected = true;
  }
}