
EnemyTank = function(index, game, bullets, coordX, coordY){


  this.mouseX = 0;
  this.mouseY = 0;
  this.bulletNumber = 1000;
  this.fireRate = 100;
  this.nextFire = 0;

  this.bullets = game.add.group();
  this.bullets.enableBody = true;
  this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
  this.bullets.createMultiple(bulletNumber, 'Bullet', 0, false);
  this.bullets.setAll('anchor.x', -0.3);
  this.bullets.setAll('anchor.y', 0.5);
  this.bullets.callAll('body.setCircle', 'body', 15, -40, -5);

  this.game = game;
  this.health = 30;

  this.tank = game.add.sprite(coordX, coordY, 'Hull_Color_A_01');
  this.turret = game.add.sprite(coordX, coordY, 'Turret_Color_A_01');

  this.tank.scale.setTo(0.5);
  this.tank.anchor.setTo(0.5, 0.65);
  this.turret.scale.setTo(0.5);
  this.turret.anchor.setTo(0.45, 0.80);

  game.physics.enable(this.tank, Phaser.Physics.ARCADE);
  this.tank.body.immovable = false;
  this.tank.body.collideWorldBounds = true;
  this.tank.enableBody = true;
  this.tank.body.setCircle(100);
  this.tank.body.setCircle(100, 25, 60);


  game.world.bringToTop(this.tank);
  game.world.bringToTop(this.turret);
  game.world.bringToTop(tank);
  game.world.bringToTop(turret);

}

EnemyTank.prototype.update = function(){

  //this.fire();
  game.physics.arcade.overlap(this.bullets, tank, this.hitEnemy, null, this);
  game.physics.arcade.overlap(bullets, this.tank, this.hittedByEnemy, null, this);
  game.physics.arcade.collide(tank, this.tank);

  this.turret.x = this.tank.x;
  this.turret.y = this.tank.y;
}

EnemyTank.prototype.fire = function(){


  if (game.time.now > this.nextFire && this.bulletNumber > 0 && this.health > 0){

    this.nextFire = game.time.now + this.fireRate;
    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(this.turret.x, this.turret.y);
    bullet.rotation = game.physics.arcade.moveToXY(bullet, this.mouseX, this.mouseY, 2000);
    this.bulletNumber -= 1;
  }
}

EnemyTank.prototype.damage = function(){

  this.health -= 1;

  if(this.health <= 0){

    this.alive = false;
    this.tank.kill();
    this.turret.kill();
  }
}

EnemyTank.prototype.hitEnemy = function(tank, bullet){

    bullet.kill();
    damage();
}

EnemyTank.prototype.hittedByEnemy = function(tank, bullet){

  bullet.kill();
  this.damage();
}

var game = new Phaser.Game(1600, 900, Phaser.AUTO, 'phaser-example',
  {
    preload: preload,
    create: create,
    update: update,
    render: render
  }
);

function preload () {

    /*game.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
    game.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    game.load.image('logo', 'assets/games/tanks/logo.png');
    game.load.image('bullet', 'assets/games/tanks/bullet.png');
    game.load.image('earth', 'assets/games/tanks/scorched_earth.png');
    game.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 64, 64, 23);
*/

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.time.advancedTiming = true;
  game.forceSingleUpdate = false;
  game.load.image('Hull_Color_A_01', './Assets/PNG/Hulls_Color_A/Hull_01.png');
  game.load.image('Hull_Color_D_01', './Assets/PNG/Hulls_Color_D/Hull_01.png');
  game.load.image('Turret_Color_A_01', './Assets/PNG/Weapon_Color_A/Gun_01.png');
  game.load.image('Turret_Color_D_01', './Assets/PNG/Weapon_Color_D/Gun_01.png');
  game.load.image('Background', './Assets/background.png');
  game.load.image('Bullet', './Assets/PNG/Effects/Plasma.png');

}

var id;
var currentSpeed = 0;
var bullets;
var bulletNumber = 1000;
var fireRate = 100;
var nextFire = 0;
var tank;
var enemy;
var isFiring;
var jsonObj;

var playerNumber = 1;
var connection;
var enemies = [];



setInterval(function(){

  if(connection.readyState == WebSocket.OPEN){

    player = {
              "isFiring": isFiring,
              "bulletNumber": bulletNumber,
              "coordX": tank.x,
              "coordY": tank.y,
              "turretRotation": turret.rotation,
              "tankRotation": tank.rotation,
              "mouseX": game.input.mousePointer.x + game.camera.x,
              "mouseY": game.input.mousePointer.y + game.camera.y
    };
    connection.send('getGameStatus;' + JSON.stringify(player));

  }

}, 10);

function create () {


  //SOCKET CONNECTION
  connection = new WebSocket('ws:192.168.1.32:8080/websockets/game');
  connection.onopen = function(){
    console.log('Connection successful');
    connection.send("getPlayerInfo");
  }
  connection.onmessage = function(e){
    //console.log(e.data);
    jsonObj = JSON.parse(e.data);

    if(jsonObj.connectedPlayerId != undefined){
      id = jsonObj.connectedPlayerId;
      tank.x = jsonObj.connectedPlayerCoordX;
      tank.y = jsonObj.connectedPlayerCoordY;
      turret.x = tank.x;
      turret.y = tank.y;
      console.log("Player id: " + id);
    }
    else{
      executeJSON(jsonObj);
    }
  }

  //SOCKET CONNECTION


  game.world.setBounds(-2000, -2000, 3000, 3000);
  game.time.slowMotion = 1;
  background = game.add.tileSprite(0, 0, 1600, 900, 'Background');
  background.fixedToCamera = true;

  tank = game.add.sprite(0, 0, 'Hull_Color_D_01');
  turret = game.add.sprite(0, 0, 'Turret_Color_D_01');
  tank.scale.setTo(0.5);
  tank.anchor.setTo(0.5, 0.65);
  turret.scale.setTo(0.5);
  turret.anchor.setTo(0.45, 0.80);



  //Bullets
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(bulletNumber, 'Bullet', 0, false);
  bullets.setAll('anchor.x', -0.3);
  bullets.setAll('anchor.y', 0.5);
  bullets.callAll('body.setCircle', 'body', 15, -40, -5);
  //Physics
  game.physics.enable(tank, Phaser.Physics.ARCADE);
  tank.body.drag.set(10);
  tank.body.maxVelocity.setTo(600, 600);
  tank.body.collideWorldBounds = true;
  tank.body.setCircle(100, 25, 60);
  tank.body.enableBody = true;
  tank.body.immovable = false;

  directions = game.input.keyboard.createCursorKeys();

  game.camera.follow(tank);

}


function update () {


  enemies.forEach(function(item){
    item.update();
  });



  if (directions.left.isDown){
    tank.angle -= 3;
  }
  else if (directions.right.isDown){
    tank.angle += 3;
  }

  if (directions.up.isDown){
    currentSpeed = 500;
  }
  else if(directions.down.isDown && currentSpeed >= 50){
    currentSpeed -= 50;
  }
  else{
    if (currentSpeed > 0){
      currentSpeed -= 5; // Slow smoothly
    }
    else if (currentSpeed < 0){
      currentSpeed = 0;
    }
  }

  if (currentSpeed > 0){
    game.physics.arcade.velocityFromRotation(tank.rotation - 1.6, currentSpeed, tank.body.velocity);
  }


  if (game.input.activePointer.isDown){

    isFiring = true;
  }
  else{
    isFiring = false;
  }

  turret.x = tank.x;
  turret.y = tank.y;
  background.tilePosition.x = -game.camera.x;
  background.tilePosition.y = -game.camera.y;


  turret.rotation = game.physics.arcade.angleToPointer(turret) + 1.54;

}

function fire () {

  if (game.time.now > nextFire && bulletNumber > 0){

    nextFire = game.time.now + fireRate;
    var bullet = bullets.getFirstExists(false);
    bullet.reset(turret.x, turret.y);
    bullet.rotation = game.physics.arcade.moveToPointer(bullet, 2000, game.input.activePointer);
    bulletNumber -= 1;
  }
}


function render () {

  game.debug.text('FPS: ' + game.time.fps + '  Bullets: ' + bulletNumber + '  ' + id, 50, 50);
  game.debug.text('X: ' + tank.x + '   Y: ' + tank.y, 50, 70);

  /*game.debug.body(enemy.tank);
  game.debug.body(tank);
  bullets.forEachAlive(renderGroup, this);*/
}

function renderGroup(member) {
  game.debug.body(member);
}

function damage(){

  console.log("damage");
}

function executeJSON(json){

  if(json.playerNumber > playerNumber){

    for(var i = 0 ; i < json.players.length ; i++){
      if(id != json.players[i].id){
        enemies[i] = new EnemyTank(json.players[i].id, game, null, json.players[i].coordX, json.players[i].coordY);
        enemies[i].bulletNumber = json.players[i].bulletNumber;
      }
    }

    playerNumber = json.playerNumber;
  }

  for(var i = 0 ; i < json.players.length ; i++){
    if(json.players[i].fire == true){
      if(json.players[i].id == id){
        fire();
      }
      else{
        enemies[i].mouseX = json.players[i].mouseX;
        enemies[i].mouseY = json.players[i].mouseY;
        enemies[i].fire();
      }
    }

    if(json.players[i].id == id){
      bulletNumber = json.players[i].bulletNumber;
      tank.x = json.players[i].coordX;
      tank.y = json.players[i].coordY;
      turret.x = tank.x;
      turret.y = tank.y;
      turret.rotation = json.players[i].turretRotation;
      tank.rotation = json.players[i].tankRotation;
    }
    else{
      enemies[i].bulletNumber = json.players[i].bulletNumber;
      enemies[i].tank.x = json.players[i].coordX;
      enemies[i].tank.y = json.players[i].coordY;
      enemies[i].turret.x = enemies[i].tank.x;
      enemies[i].turret.y = enemies[i].tank.y;
      enemies[i].turret.rotation = json.players[i].turretRotation;
      enemies[i].tank.rotation = json.players[i].tankRotation;

    }
  }
}
