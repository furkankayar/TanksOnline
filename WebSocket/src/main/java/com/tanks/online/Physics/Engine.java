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

      boolean canMove = true;
      double playerX = player.getX();
      double playerY = player.getY();

      if(System.currentTimeMillis() >= player.getLastUpdateTime() + player.getTiming()){
        if(player.isAccelerating())
          player.velocityFromAngle();

        if(player.isRotatingLeft())
          player.rotateLeft();
        else if(player.isRotatingRight())
          player.rotateRight();

        player.setLastUpdateTime(System.currentTimeMillis());
      }

      for(Player otherPlayer : this.players){

        if(player != otherPlayer && canMove){
          canMove = !isColliding(player, otherPlayer);
        }
      }

      if(!canMove){
        player.setLocation(playerX, playerY);
      }

      player.fixTurret();



      if(player.isFiring())
        player.fireBullet();

      int[] worldBounds = this.world.getBounds();


      for(Bullet bullet : player.getFiredBullets()){

        if(System.currentTimeMillis() >= bullet.getLastUpdateTime() + bullet.getTiming()){

          bullet.velocityFromAngle();
          bullet.setLastUpdateTime(System.currentTimeMillis());
        }
        if(bullet.getX() > worldBounds[0] + worldBounds[2] || bullet.getX() < worldBounds[0] ||
           bullet.getY() > worldBounds[1] + worldBounds[3] || bullet.getY() < worldBounds[1])
           player.removeFiredBullet(bullet);
      }
    }
  }

  private boolean isColliding(Player player1, Player player2){

    boolean isColliding = false;
    double player1HitboxArea = player1.getHitboxArea();
    double[] player1HitboxCoordinates = player1.getHitboxCoordinates();
    double[] player2HitboxCoordinates = player2.getHitboxCoordinates();

    for(int i = 0; i < 7 ; i+= 2){

      if(player1HitboxArea >= calculateTotalAreaOfTrianglesBetweenRectangleAndPoint(new double[]{ player1HitboxCoordinates[i], player1HitboxCoordinates[i+1]}, player2HitboxCoordinates)){
        isColliding = true;
      }
    }

    return isColliding;
  }

  private double calculateTotalAreaOfTrianglesBetweenRectangleAndPoint(double[] point, double[] rectangle){

    /* Assume point is P(x, y) and Rectangle A(x1, y1), B(x2, y2), C(x3, y3), D(x4, y4)
       we need total areas of triangles ( APD, DPC, CPB, BPA )

       Assuming the three points are:  A(x,y),  B(x,y),  C(x,y)
       Area = abs( Ax(By - Cy) + Bx(Cy - Ay) + Cx(Ay - By) ) / 2

       https://stackoverflow.com/questions/17136084/checking-if-a-point-is-inside-a-rotated-rectangle/17146376

    */

    return /* APD */ Math.abs(((rectangle[0] * (point[1] - rectangle[7])) + (point[0] * (rectangle[7] - rectangle[1])) + (rectangle[6] * (rectangle[1] - point[1]))) / 2) +
           /* DPC */ Math.abs(((rectangle[6] * (point[1] - rectangle[5])) + (point[0] * (rectangle[5] - rectangle[7])) + (rectangle[4] * (rectangle[7] - point[1]))) / 2) +
           /* CPB */ Math.abs(((rectangle[4] * (point[1] - rectangle[3])) + (point[0] * (rectangle[3] - rectangle[5])) + (rectangle[2] * (rectangle[5] - point[1]))) / 2) +
           /* BPA */ Math.abs(((rectangle[2] * (point[1] - rectangle[1])) + (point[0] * (rectangle[1] - rectangle[3])) + (rectangle[0] * (rectangle[3] - point[1]))) / 2);
  }

  public List<Player> getPlayers(){

    return this.players;
  }

  @Override
  public void run(){

    while(true){
      try{
        this.update();
      }
      catch(ConcurrentModificationException ex){

      }
      catch(Exception e){}
    }
  }
}
