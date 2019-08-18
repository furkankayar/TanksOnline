
class EnemyTank{

  constructor(id, game, coordX, coordY, isAlive){

    this.id = id;
    this.mouseX = 0;
    this.mouseY = 0;
    this.health = 0
    this.game = game;

    this.tank = game.add.sprite(coordX, coordY, 'Hull_Color_A_01');
    this.turret = game.add.sprite(coordX, coordY, 'Turret_Color_A_01');
    this.healthBar = game.add.sprite(0, 0, 'HealthBar');
    this.explosion = game.add.sprite(-5000, -5000, 'Explosion');
    this.explosion.anchor.setTo(0.5, 0.5);
    this.explosion.animations.add('explosion');
    this.tank.scale.setTo(0.5);
    this.tank.anchor.setTo(0.5, 0.5);
    this.turret.scale.setTo(0.5);
    this.turret.anchor.setTo(0.45, 0.80);
    this.alive = isAlive;
  }

}



class MainTank{

  constructor(id, game, coordX, coordY){

    this.id = id;
    this.mouseX = 0;
    this.mouseY = 0;
    this.health = 0;
    this.game = game;

    this.tank = game.add.sprite(coordX, coordY, 'Hull_Color_D_01');
    this.turret = game.add.sprite(coordX, coordY, 'Turret_Color_D_01');
    this.healthBar = game.add.sprite(0, 0, 'HealthBar');
    this.explosion = game.add.sprite(-5000, -5000, 'Explosion');
    this.explosion.anchor.setTo(0.5, 0.5);
    this.explosion.animations.add('explosion');
    this.tank.scale.setTo(0.5);
    this.tank.anchor.setTo(0.5, 0.5);
    this.turret.scale.setTo(0.5);
    this.turret.anchor.setTo(0.45, 0.80);


    this.isFiring = false;
    this.isAccelerating = false;
    this.isReverseAccelerating = false;
    this.isRotatingLeft = false;
    this.isRotatingRight = false;
  }
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
  game.load.image('Background', './Assets/background3.png');
  game.load.image('Bullet', './Assets/PNG/Effects/Plasma.png');
  game.load.image('HealthBar', './Assets/healthbar.png');
  game.load.spritesheet('Explosion', './Assets/explosionSpriteSheet2.png', 256 , 256, 48);

}


var jsonObj;

var playerNumber = 1;
var connection;
var enemies = [];
var bullets = [];
var date = new Date();
var time;
var ping;
var canPlay = true;

var player;

function create () {


  //SOCKET CONNECTION

  connection = new WebSocket('ws:192.168.1.32:8080/websockets/game');
  connection.onopen = function(){
    console.log('Connection successful');
    connection.send("getPlayerInfo");
  }
  connection.onmessage = function(e){

    ping = date.getTime() - time;
    jsonObj = JSON.parse(e.data);


    if(jsonObj.connectedPlayerId != undefined){

      player = new MainTank(jsonObj.connectedPlayerId, game, jsonObj.connectedPlayerCoordX, jsonObj.connectedPlayerCoordY);
      console.log("Player id: " + player.id);
    }
    else{
      executeJSON(jsonObj);
    }



  }

  //SOCKET CONNECTION


  game.world.setBounds(-2000, -2000, 4000, 4000);
  game.time.slowMotion = 1;
  background = game.add.tileSprite(-2000, -2000, 4000, 4000, 'Background');



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

}

setInterval(function(){

  if(connection && connection.readyState == WebSocket.OPEN && player != undefined){

    message = {
              "isFiring": player.isFiring,
              "isAccelerating": player.isAccelerating,
              "isReverseAccelerating": player.isReverseAccelerating,
              "isRotatingLeft": player.isRotatingLeft,
              "isRotatingRight": player.isRotatingRight,
              "mouseX": game.input.mousePointer.x + game.camera.x,
              "mouseY": game.input.mousePointer.y + game.camera.y
    };
    connection.send("getGameStatus;" + JSON.stringify(message));
    time = date.getTime();
  }

}, 16.667);


function update () {


  if(connection && connection.readyState == WebSocket.OPEN && player != undefined){

    game.camera.x = player.tank.x + 50 * Math.sin(player.turret.angle * 3.14 / 180) - 800;
    game.camera.y = player.tank.y - 50 * Math.cos(player.turret.angle * 3.14 / 180) - 450;

    if(directions.up.isDown || wasdKeys.W.isDown){

      player.isAccelerating = true;
    }
    else{

      player.isAccelerating = false;
    }

    if(directions.down.isDown || wasdKeys.S.isDown){

      player.isReverseAccelerating = true;
    }
    else{

      player.isReverseAccelerating = false;
    }

    if(directions.left.isDown || wasdKeys.A.isDown){

      player.isRotatingLeft = true;
    }
    else{

      player.isRotatingLeft = false;
    }

    if(directions.right.isDown || wasdKeys.D.isDown){

      player.isRotatingRight = true;
    }
    else{

      player.isRotatingRight = false;
    }

    if(game.input.activePointer.isDown){

      player.isFiring = true;
    }
    else{

      player.isFiring = false;
    }
  }
}


function render () {

  if(connection && connection.readyState == WebSocket.OPEN && player != undefined){

    game.debug.text('FPS: ' + game.time.fps + ' Ping: ' + ping + ' ID: ' + player.id ,50, 50);
    game.debug.text('X: ' + player.tank.x + '   Y: ' + player.tank.y, 50, 70);
  }
  if(!canPlay){
    game.debug.text('You Are Dead!!', 700, 430, 'white',  '36px Courier');
  }
}


function executeJSON(json){


  if(json.playerNumber > playerNumber){

    for(var i = 0 ; i < json.players.length ; i++){

      if(player.id == json.players[i].id){
        continue;
      }

      var found = false;
      for(var k = 0 ; k < enemies.length ; k++){
        if(enemies[k].id == json.players[i].id){
          found = true;
        }
      }

      if(!found){
        enemies[enemies.length] = new EnemyTank(json.players[i].id, game, json.players[i].positionX, json.players[i].positionY, json.players[i].isAlive);
        game.world.bringToTop(player.tank);
        game.world.bringToTop(player.turret);
        playerNumber += 1;
      }
    }
  }


  for(var i = 0 ; i < json.players.length ; i++){

    if(json.players[i].id == player.id){

      if(!json.players[i].isAlive && canPlay){

        var tankX = player.tank.x;
        var tankY = player.tank.y;

        player.tank.kill();
        player.turret.kill();
        player.healthBar.kill();

        if(canPlay){
          game.world.bringToTop(player.explosion);
          player.explosion.x = tankX;
          player.explosion.y = tankY;
          player.explosion.animations.play('explosion', 30, false);
          canPlay = false;
        }
      }

      player.tank.x = json.players[i].positionX;
      player.tank.y = json.players[i].positionY;
      player.turret.angle = json.players[i].turretAngle;
      player.turret.x = json.players[i].turretX;
      player.turret.y = json.players[i].turretY;
      player.tank.angle = json.players[i].angle;
      player.health = json.players[i].health;
      player.healthBar.x = player.tank.x - 50;
      player.healthBar.y = player.tank.y + 100;
      player.healthBar.width = (player.health / 100) * 100;
      player.healthBar.x += (100 - (player.health / 100) * 100 ) / 2;

    }
    else{

      for(var k = 0 ; k < enemies.length ; k++){

        if(enemies[k].id == json.players[i].id){

          if(!json.players[i].isAlive){

            var tankX = enemies[k].tank.x;
            var tankY = enemies[k].tank.y;
            enemies[k].tank.kill();
            enemies[k].turret.kill();
            enemies[k].healthBar.kill();

            if(enemies[k].alive){
              game.world.bringToTop(enemies[k].explosion);
              enemies[k].explosion.x = tankX;
              enemies[k].explosion.y = tankY;
              enemies[k].explosion.animations.play('explosion', 30, false);
              enemies[k].alive = false;
            }
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
