
EnemyTank = function(id, game, bullets, coordX, coordY){

  this.id = id;
  this.mouseX = 0;
  this.mouseY = 0;
  this.health = 0
  this.game = game;

  this.tank = game.add.sprite(coordX, coordY, 'Hull_Color_A_01');
  this.turret = game.add.sprite(coordX, coordY, 'Turret_Color_A_01');
  this.healthBar = game.add.sprite(0, 0, 'HealthBar');
  this.tank.scale.setTo(0.5);
  this.tank.anchor.setTo(0.5, 0.5);
  this.turret.scale.setTo(0.5);
  this.turret.anchor.setTo(0.45, 0.80);

  game.world.bringToTop(this.tank);
  game.world.bringToTop(tank);
  game.world.bringToTop(this.turret);
  game.world.bringToTop(turret);

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


  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.time.advancedTiming = true;
  game.forceSingleUpdate = false;
  game.load.image('Hull_Color_A_01', './Assets/PNG/Hulls_Color_A/Hull_01.png');
  game.load.image('Hull_Color_D_01', './Assets/PNG/Hulls_Color_D/Hull_01.png');
  game.load.image('Turret_Color_A_01', './Assets/PNG/Weapon_Color_A/Gun_01.png');
  game.load.image('Turret_Color_D_01', './Assets/PNG/Weapon_Color_D/Gun_01.png');
//  game.load.image('Background', './Assets/background.png');
  game.load.image('Background', './Assets/background3.png');
  game.load.image('Bullet', './Assets/PNG/Effects/Plasma.png');
  game.load.image('HealthBar', './Assets/healthbar.png');

}

var id;

var tank;
var healthBar;
var health;

var isFiring = false;
var isAccelerating = false;
var isReverseAccelerating = false;
var isRotatingLeft = false;
var isRotatingRight = false;

var jsonObj;

var playerNumber = 1;
var connection;
var enemies = [];
var bullets = [];
var date = new Date();
var time;
var ping;
var canPlay = true;


var nwX;
var nwY;
var neX;
var neY;
var swX;
var swY;
var seX;
var seY;

var txnw ;
var txne ;
var txsw ;
var txse ;
var txctr;


// RENDER //

function create () {


  //SOCKET CONNECTION

  connection = new WebSocket('ws:192.168.1.32:8080/websockets/game');
  connection.onopen = function(){
    console.log('Connection successful');
    connection.send("getPlayerInfo");
  }
  connection.onmessage = function(e){
  //  console.log(e.data);
    ping = date.getTime() - time;
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


  game.world.setBounds(-2000, -2000, 4000, 4000);
  game.time.slowMotion = 1;
  background = game.add.tileSprite(-2000, -2000, 4000, 4000, 'Background');
//  background.fixedToCamera = true;

  tank = game.add.sprite(0, 0, 'Hull_Color_D_01');
  turret = game.add.sprite(0, 0, 'Turret_Color_D_01');
  tank.scale.setTo(0.5);
  tank.anchor.setTo(0.5, 0.5);
  turret.scale.setTo(0.5);
  turret.anchor.setTo(0.45, 0.80);
//  tank.fixedToCamera = true;

  healthBar = game.add.sprite(0, 0, 'HealthBar');


  //Bullets
  bullets = game.add.group();
  bullets.createMultiple(1000, 'Bullet', 0, false);
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 0.5);



  directions = game.input.keyboard.createCursorKeys();
  wasdKeys = {"A": game.input.keyboard.addKey(Phaser.Keyboard.A),
              "W": game.input.keyboard.addKey(Phaser.Keyboard.W) ,
              "D": game.input.keyboard.addKey(Phaser.Keyboard.D) ,
              "S": game.input.keyboard.addKey(Phaser.Keyboard.S)};

  this.game.renderer.renderSession.roundPixels = true; // I don't know if it works, will be checked later.


// RENDER //

  /*txnw = game.add.text(nwX, nwY, '.', {fill : 'white'});
  txne = game.add.text(neX, neY, '.', {fill : 'white'});
  txsw = game.add.text(swX, swY, '.', {fill : 'white'});
  txse = game.add.text(seX, seY, '.', {fill : 'white'});
  txctr = game.add.text(tank.x, tank.y, '*', {fill: 'white'});*/

// RENDER //
}

setInterval(function(){

  if(connection && connection.readyState == WebSocket.OPEN){

    player = {
              "isFiring": isFiring,
              "isAccelerating": isAccelerating,
              "isReverseAccelerating": isReverseAccelerating,
              "isRotatingLeft": isRotatingLeft,
              "isRotatingRight": isRotatingRight,
              "mouseX": game.input.mousePointer.x + game.camera.x,
              "mouseY": game.input.mousePointer.y + game.camera.y
    };
    connection.send("getGameStatus;" + JSON.stringify(player));
    time = date.getTime();
  }

}, 16.667);


function update () {

/*  txnw.x = nwX;
  txnw.y = nwY;
  txne.x = neX;
  txne.y = neY;
  txsw.x = swX;
  txsw.y = swY;
  txse.x = seX;
  txse.y = seY;
  txctr.x = tank.x;
  txctr.y = tank.y;*/

  game.camera.x = tank.x + 50 * Math.sin(turret.angle * 3.14 / 180) - 800;
  game.camera.y = tank.y - 50 * Math.cos(turret.angle * 3.14 / 180) - 450;



  if(directions.up.isDown || wasdKeys.W.isDown){

    isAccelerating = true;
  }
  else{

    isAccelerating = false;
  }

  if(directions.down.isDown || wasdKeys.S.isDown){

    isReverseAccelerating = true;
  }
  else{

    isReverseAccelerating = false;
  }

  if(directions.left.isDown || wasdKeys.A.isDown){

    isRotatingLeft = true;
  }
  else{

    isRotatingLeft = false;
  }

  if(directions.right.isDown || wasdKeys.D.isDown){

    isRotatingRight = true;
  }
  else{

    isRotatingRight = false;
  }

  if(game.input.activePointer.isDown){

    isFiring = true;
  }
  else{

    isFiring = false;
  }
}


function render () {

  game.debug.text('FPS: ' + game.time.fps + ' Ping: ' + ping + ' ID: ' + id ,50, 50);
  game.debug.text('X: ' + tank.x + '   Y: ' + tank.y, 50, 70);

  if(!canPlay){
    game.debug.text('You Are Dead!!', 700, 430, 'white',  '36px Courier');
  }
}


function executeJSON(json){

  /*if(json.playerNumber > playerNumber){

    for(var i = 0 ; i < json.players.length ; i++){
      if(id != json.players[i].id){
        enemies[i] = new EnemyTank(json.players[i].id, game, null, json.players[i].positionX, json.players[i].positionY);
        enemies[i].bulletNumber = json.players[i].bulletNumber;
      }
    }

    playerNumber = json.playerNumber;
  }*/
/*  if(json.playerNumber > playerNumber){

    for(var i = 0 ; i < json.players.length ; i++){

      if(id == json.players[i].id){
        continue;
      }

      var found = false;
      for(var k = 0 ; k < enemies.length ; k++){
        if(enemies[k].id == json.players[i].id){
          found = true;
        }
      }

      if(!found){
        enemies[i] = new EnemyTank(json.players[i].id, game, null, json.players[i].positionX, json.players[i].positionY);
      }

      playerNumber = json.playerNumber;
    }
  }*/


  if(json.playerNumber > playerNumber){

    for(var i = 0 ; i < json.players.length ; i++){

      if(id == json.players[i].id){
        continue;
      }

      var found = false;
      for(var k = 0 ; k < enemies.length ; k++){
        if(enemies[k].id == json.players[i].id){
          found = true;
        }
      }

      if(!found){
        enemies[enemies.length] = new EnemyTank(json.players[i].id, game, null, json.players[i].positionX, json.players[i].positionY);
        playerNumber += 1;
      }
    }
  }


  for(var i = 0 ; i < json.players.length ; i++){

    if(json.players[i].id == id){

      if(!json.players[i].isAlive && canPlay){
        tank.kill();
        turret.kill();
        healthBar.kill();
        canPlay = false;
      }
      bulletNumber = json.players[i].bulletNumber;
      tank.x = json.players[i].positionX;
      tank.y = json.players[i].positionY;
      turret.angle = json.players[i].turretAngle;
      turret.x = json.players[i].turretX;
      turret.y = json.players[i].turretY;
      tank.angle = json.players[i].angle;
      health = json.players[i].health;
      healthBar.x = tank.x - 50;
      healthBar.y = tank.y + 100;
      healthBar.width = (health / 100) * 100;
      healthBar.x += (100 - (health / 100) * 100 ) / 2;

      nwX = json.players[i].nwX;
      nwY = json.players[i].nwY;
      neX = json.players[i].neX;
      neY = json.players[i].neY;
      swX = json.players[i].swX;
      swY = json.players[i].swY;
      seX = json.players[i].seX;
      seY = json.players[i].seY;

    }
    else{

      for(var k = 0 ; k < enemies.length ; k++){

        if(enemies[k].id == json.players[i].id){

          if(!json.players[i].isAlive){
            enemies[k].tank.kill();
            enemies[k].turret.kill();
            enemies[k].healthBar.kill();
          }
          else{
            enemies[k].bulletNumber = json.players[i].bulletNumber;
            enemies[k].tank.x = json.players[i].positionX;
            enemies[k].tank.y = json.players[i].positionY;
            enemies[k].turret.x = json.players[i].turretX;
            enemies[k].turret.y = json.players[i].turretY;
            enemies[k].turret.angle = json.players[i].turretAngle;
            enemies[k].tank.angle = json.players[i].angle;
            enemies[k].health = json.players[i].health;
            enemies[k].healthBar.x = enemies[k].tank.x - 50;
            enemies[k].healthBar.y = enemies[k].tank.y + 100;
            enemies[k].healthBar.width = (enemies[k].health / 100) * 100;
            enemies[k].healthBar.x += (100 - (enemies[k].health / 100) * 100 ) / 2;
          }
        }
      }
    }
  }

  bullets.resetAll(-5000, -5000);

  for(var i = 0 ; i < json.bullets.length ; i++){

    var bullet = bullets.children[i];
    bullet.reset(json.bullets[i].x, json.bullets[i].y);
    bullet.angle = json.bullets[i].angle;
  }
}
