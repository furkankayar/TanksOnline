package com.tanks.online.Physics;

import com.tanks.online.Components.Player;
import com.tanks.online.Components.Bullet;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.util.ConcurrentModificationException;

public class Engine extends Thread{

  private World world;

  private List<Player> players;

  public Engine(){

    this.world = new World();
    this.world.setBounds(-2000, -2000, 4000, 4000);
    this.players = Collections.synchronizedList(new ArrayList<Player>());

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

      double[] coordinates = player.getHitboxCoordinates();
    /*  System.out.println("nwX " + coordinates[0] +
                       "\nnwY " + coordinates[1] +
                       "\nneX " + coordinates[2] +
                       "\nneY " + coordinates[3] +
                       "\nswX " + coordinates[4] +
                       "\nswY " + coordinates[5] +
                       "\nseX " + coordinates[6] +
                       "\nseY " + coordinates[7] + "\n---------------------------\n");*/

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

  @Override
  public void run(){

    while(true){
      try{
        this.update();
        Thread.sleep(5);
      }
      catch(ConcurrentModificationException ex){

      }
      catch(Exception e){}
    }
  }
}
