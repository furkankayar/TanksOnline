package com.tanks.online.Physics;

import com.tanks.online.Components.Player;
import com.tanks.online.Components.Bullet;
import com.tanks.online.Components.Turret;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;
import java.util.ConcurrentModificationException;

public class Engine extends Thread{

  private World world;

  private List<Player> players;
  private Hitbox hitboxUtilities;

  public Engine(){

    this.world = new World();
    this.world.setBounds(-2000, -2000, 4000, 4000);
    this.hitboxUtilities = Hitbox.getInstance();
    this.players = Collections.synchronizedList(new ArrayList<Player>());

  }

  public void addBodyToEngine(Player player){
    this.players.add(player);
  }

  public World getWorld(){

    return world;
  }


  //GAME LOOP
  public void update(int[] worldBounds){

    for(Player player: this.players){

      boolean canMove = true;
      double playerX = player.getX();
      double playerY = player.getY();
      int playerAngle = player.getAngle();

      if(player.isAlive()){

        if(System.currentTimeMillis() >= player.getLastUpdateTime() + player.getTiming()){

          player.velocityFromAngle();

          if(player.isRotatingLeft())
            player.rotateLeft();
          else if(player.isRotatingRight())
            player.rotateRight();

          player.setLastUpdateTime(System.currentTimeMillis());
        }

        for(Bullet bullet : player.getFiredBullets()){

          if(System.currentTimeMillis() >= bullet.getLastUpdateTime() + bullet.getTiming()){

            bullet.velocityFromAngle();
            bullet.setLastUpdateTime(System.currentTimeMillis());
          }

          if(bullet.getX() > worldBounds[0] + worldBounds[2] || bullet.getX() < worldBounds[0] ||
            bullet.getY() > worldBounds[1] + worldBounds[3] || bullet.getY() < worldBounds[1])
            player.removeFiredBullet(bullet);
        }

        for(Player otherPlayer : this.players){

          if(player != otherPlayer){

            for(Bullet bullet : player.getFiredBullets()){

              if(hitboxUtilities.isCollidingPlayerAndBullet(bullet, otherPlayer)){
                player.removeFiredBullet(bullet);
              }
            }

            if(canMove)
              canMove = !hitboxUtilities.isCollidingTwoPlayers(player, otherPlayer);
          }
        }

        if(!canMove){
          player.setLocation(playerX, playerY);
          player.setAngle(playerAngle);
        }

        player.fixTurret();

        if(player.isFiring())
          player.fireBullet();

      }
      else{

        if(player.getFiredBullets().size() > 0){

          for(Bullet bullet : player.getFiredBullets()){

            if(System.currentTimeMillis() >= bullet.getLastUpdateTime() + bullet.getTiming()){

              bullet.velocityFromAngle();
              bullet.setLastUpdateTime(System.currentTimeMillis());
            }

            if(bullet.getX() > worldBounds[0] + worldBounds[2] || bullet.getX() < worldBounds[0] ||
              bullet.getY() > worldBounds[1] + worldBounds[3] || bullet.getY() < worldBounds[1])
              player.removeFiredBullet(bullet);
          }

          for(Player otherPlayer : this.players){

            if(player != otherPlayer){

              for(Bullet bullet : player.getFiredBullets()){

                if(hitboxUtilities.isCollidingPlayerAndBullet(bullet, otherPlayer)){
                  player.removeFiredBullet(bullet);
                }
              }
            }
          }
        }
        else{
          this.players.remove(player);
        }
      }
    }
  }



  public List<Player> getPlayers(){

    return this.players;
  }

  @Override
  public void run(){

    int[] worldBounds = this.world.getBounds();
    while(true){
      try{
        this.update(worldBounds);
      }
      catch(ConcurrentModificationException ex){

      }
      catch(Exception e){}
    }
  }
}
