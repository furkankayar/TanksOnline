package com.tanks.online.Physics;

import com.tanks.online.Components.Player;
import com.tanks.online.Components.Bullet;

import java.util.ArrayList;

public class Engine{

  private World world;

  private ArrayList<Player> players;

  public Engine(){

    this.world = new World();
    this.world.setBounds(-2000, -2000, 4000, 4000);
    this.players = new ArrayList<Player>();

  }

  public void addBodyToEngine(Player player){
    this.players.add(player);
  }

  public World getWorld(){

    return world;
  }


  //GAME LOOP
  public void update(){

    for(Player player: this.players){

      player.setTurretAngle((int)(Math.toDegrees(Math.atan2(player.getMouseY() - player.getY(), player.getMouseX() - player.getX()))) + 90);

      if(player.isAccelerating())
        player.velocityFromAngle();


      if(player.isRotatingLeft())
        player.rotateLeft();
      else if(player.isRotatingRight())
        player.rotateRight();

      if(player.isFiring())
        player.fireBullet();

      int[] worldBounds = this.world.getBounds();
      for(Bullet bullet : player.getFiredBullets()){

        bullet.velocityFromAngle();

        if(bullet.getX() > worldBounds[0] + worldBounds[2] || bullet.getX() < worldBounds[0] ||
           bullet.getY() > worldBounds[1] + worldBounds[3] || bullet.getY() < worldBounds[1])
           player.removeFiredBullet(bullet);
      }
    }
  }

}
