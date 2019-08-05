
EnemyTank = function(index, game, bullets, coordX, coordY){


  this.mouseX = 0;
  this.mouseY = 0;

  this.game = game;

  this.tank = game.add.sprite(coordX, coordY, 'Hull_Color_A_01');
  this.turret = game.add.sprite(coordX, coordY, 'Turret_Color_A_01');

  this.tank.scale.setTo(0.5);
  this.tank.anchor.setTo(0.5, 0.5);
  this.turret.scale.setTo(0.5);
  this.turret.anchor.setTo(0.45, 0.80);

  game.world.bringToTop(this.tank);
  game.world.bringToTop(this.turret);
  game.world.bringToTop(tank);
  game.world.bringToTop(turret);

}

EnemyTank.prototype.update = function(){

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
  game.load.image('Background', './Assets/background.png');
  game.load.image('Bullet', './Assets/PNG/Effects/Plasma.png');

}

var id;

var tank;

var isFiring = false;
var isAccelerating = false;
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
  background = game.add.tileSprite(0, 0, 1600, 900, 'Background');
  background.fixedToCamera = true;

  tank = game.add.sprite(0, 0, 'Hull_Color_D_01');
  turret = game.add.sprite(0, 0, 'Turret_Color_D_01');
  tank.scale.setTo(0.5);
  tank.anchor.setTo(0.5, 0.5);
  turret.scale.setTo(0.5);
  turret.anchor.setTo(0.45, 0.80);



  //Bullets
  bullets = game.add.group();
  bullets.createMultiple(1000, 'Bullet', 0, false);
  bullets.setAll('anchor.x', -0.3);
  bullets.setAll('anchor.y', 0.5);



  directions = game.input.keyboard.createCursorKeys();


  game.camera.follow(tank);

  txnw = game.add.text(nwX, nwY, '.', {fill : 'white'});
  txne = game.add.text(neX, neY, '.', {fill : 'white'});
  txsw = game.add.text(swX, swY, '.', {fill : 'white'});
  txse = game.add.text(seX, seY, '.', {fill : 'white'});
  txctr = game.add.text(tank.x, tank.y, '*', {fill: 'white'});

}

setInterval(function(){

  if(connection && connection.readyState == WebSocket.OPEN){

    player = {
              "isFiring": isFiring,
              "isAccelerating": isAccelerating,
              "isRotatingLeft": isRotatingLeft,
              "isRotatingRight": isRotatingRight,
              "mouseX": game.input.mousePointer.x + game.camera.x,
              "mouseY": game.input.mousePointer.y + game.camera.y
    };
    connection.send("getGameStatus;" + JSON.stringify(player));
    time = date.getTime();
  }

}, 20);


function update () {

  txnw.x = nwX;
  txnw.y = nwY;
  txne.x = neX;
  txne.y = neY;
  txsw.x = swX;
  txsw.y = swY;
  txse.x = seX;
  txse.y = seY;
  txctr.x = tank.x;
  txctr.y = tank.y;


  background.tilePosition.x = -game.camera.x;
  background.tilePosition.y = -game.camera.y;

  if(directions.up.isDown){

    isAccelerating = true;
  }
  else{

    isAccelerating = false;
  }

  if(directions.left.isDown){

    isRotatingLeft = true;
  }
  else{

    isRotatingLeft = false;
  }

  if(directions.right.isDown){

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

}


function executeJSON(json){

  if(json.playerNumber > playerNumber){

    for(var i = 0 ; i < json.players.length ; i++){
      if(id != json.players[i].id){
        enemies[i] = new EnemyTank(json.players[i].id, game, null, json.players[i].positionX, json.players[i].positionY);
        enemies[i].bulletNumber = json.players[i].bulletNumber;
      }
    }

    playerNumber = json.playerNumber;
  }
  else if(json.playerNumber < playerNumber){ // WHEN A PLAYER DISCONNECTS, IT WILL BE REMOVED FROM THE GAME

    for(var i = 0 ; i < enemies.length ; i++){
      var found = false;
      for(var j = 0 ; j < json.playerNumber ; j++){

        if(enemies[i].id == json.players[j].id){
          found = true;
        }
      }
      if(!found){

        enemies[i].tank.kill();
        enemies[i].turret.kill();
        for(var k = i ; k < enemies.length - 1 ; k++){
          enemies[k] = enemies[k + 1];
        }

        continue;
      }
    }

    playerNumber = json.playerNumber;
  }

  for(var i = 0 ; i < json.players.length ; i++){


    if(json.players[i].id == id){
      bulletNumber = json.players[i].bulletNumber;
      tank.x = json.players[i].positionX;
      tank.y = json.players[i].positionY;
      turret.angle = json.players[i].turretAngle;
      turret.x = json.players[i].turretX;
      turret.y = json.players[i].turretY;
      tank.angle = json.players[i].angle;

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
      enemies[i].bulletNumber = json.players[i].bulletNumber;
      enemies[i].tank.x = json.players[i].positionX;
      enemies[i].tank.y = json.players[i].positionY;
      enemies[i].turret.x = json.players[i].turretX;
      enemies[i].turret.y = json.players[i].turretY;
      enemies[i].turret.angle = json.players[i].turretAngle;
      enemies[i].tank.angle = json.players[i].angle;

    }
  }

 bullets.resetAll(-5000, -5000);

 for(var i = 0 ; i < json.bullets.length ; i++){

   var bullet = bullets.children[i];
   bullet.reset(json.bullets[i].x, json.bullets[i].y);
   bullet.angle = json.bullets[i].angle - 90;
  }
}
