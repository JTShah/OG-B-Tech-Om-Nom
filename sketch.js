const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground;
var rope, rope2, rope3;
var fruit, fruit_img;
var fruit_con, fruit_con2, fruit_con3 ; //con is short for connections
var bg_img, bunny_img, bunny;
var button_1, button_2, button_3;
var eat,blink,sad;
var distance;
var airBlower;
var air_sound, eat_sound, cut_sound, sad_sound, bg_sound;
var mute_bgm;
var phone, canW, canH; //can=canvas


//the 3 great functions...

function preload() {

 fruit_img = loadImage("Orange.png");
 bg_img= loadImage("background.png");
 bunny_img= loadImage("Rabbit-01.png");
 blink=loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
 eat=loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
 sad=loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");

 sad_sound= loadSound("sad.wav");
 cut_sound= loadSound("rope_cut.mp3");
 bg_sound= loadSound("sound1.mp3");
 eat_sound= loadSound("eating_sound.mp3");
 air_sound= loadSound("air.wav");


 blink.playing =true;
 eat.playing =true;
 sad.playing =true;
 eat.looping =false;
 sad.looping =false;

}

function setup() 
{
 phone= /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if(phone) {
    canW=displayWidth;
    canH=displayHeight;

    createCanvas(canW+80,canH);

  }
  else {
    canW=windowWidth;
    canH=windowHeight;

    createCanvas(canW+80,canH);
  }
 
 

  engine = Engine.create();
  world = engine.world;

  bg_sound.play();
  bg_sound.setVolume(0.05);
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

  // var fruit_options= {
  //   density:0.01
  // };

  ground= new Ground(canW/2,canH+5, canW, 20);
  
  rope= new Rope(9, {x:105, y:60});
  rope2= new Rope(6, {x:380, y:70});
  rope3= new Rope(4, {x:460, y:240});
  
  fruit= Bodies.circle(300, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con= new Link(rope, fruit);
  fruit_con2= new Link(rope2, fruit);
  fruit_con3= new Link(rope3, fruit);


  bunny= createSprite(250, canH-90, 100, 100);
  //bunny.addImage("bunny", bunny_img);
  bunny.scale= 0.25;
  blink.frameDelay= 25;
  eat.frameDelay= 25;
  sad.frameDelay= 25;
  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("starving", sad);

  bunny.changeAnimation("blinking");

// cut button_1:
  button_1 = createImg("cut_button.png");
  button_1.position(85, 60);
  button_1.size(40,40);
  button_1.mouseClicked(drop1);

// cut button_2:
  button_2 = createImg("cut_button.png");
  button_2.position(360,50);
  button_2.size(40,40);
  button_2.mouseClicked(drop2);

// cut button_3:
  button_3 = createImg("cut_button.png");
  button_3.position(440, 220);
  button_3.size(40,40);
  button_3.mouseClicked(drop3);

  airBlower= createImg("blower.png");
  airBlower.position(10, 250);
  airBlower.size(125,100);
  airBlower.mouseClicked(pushFruit);





  mute_bgm= createImg("mute.png");
  mute_bgm.position(430, 20);
  mute_bgm.size(50,50);
  mute_bgm.mouseClicked(shutUp);


  imageMode(CENTER);


}

function draw() 
{
  
  image(bg_img, canW/2, canH/2, canW, canH+80);
  

  ground.show();

  rope.show();
  rope2.show();
  rope3.show();
  if(fruit != null) {
    image(fruit_img, fruit.position.x, fruit.position.y, 50, 50);

  }
  
   //detectCollision(fruit, bunny);
    if(detectCollision(fruit,bunny) == true) {
      eat_sound.play();
      bunny.changeAnimation("eating");
    }

    if(detectCollision(fruit, ground.body) == true) {
      sad_sound.play();
      bunny.changeAnimation("starving");
    }

  
    




  Engine.update(engine);
  drawSprites();
}

//lesser functions...

function drop1() {
  cut_sound.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null;

}

function drop2() {
  cut_sound.play();
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null;
}

function drop3() {
  cut_sound.play();
  rope3.break();
  fruit_con3.detach();
  fruit_con3 = null;
}




function detectCollision(body, sprite) {
  if(body != null) {
    distance= dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y );
    if(distance<= 100) {
      console.log("collided");
      World.remove(engine.world, fruit);
      fruit=null;
      return true;
    }
      else{
        return false;
      }
  }
}

function pushFruit() {
  Matter.Body.applyForce(fruit, {
    x:0,
    y:0
  }, {
    x:0.01,
    y:0
  });
  air_sound.play();
}

function shutUp() {
  if(bg_sound.isPlaying()) {
    bg_sound.stop();
  
  }

  else {
    bg_sound.play();
  }
}

