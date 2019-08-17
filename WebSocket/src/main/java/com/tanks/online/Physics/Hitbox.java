package com.tanks.online.Physics;


import com.tanks.online.Components.Player;
import com.tanks.online.Components.Bullet;

//Utility class
public class Hitbox{

  private static Hitbox instance;

  private Hitbox(){

  }

  public double[] getCornerPositions(double x, double y, int length, int height, int angle, int paddingX, int paddingY){

    double radians = Math.toRadians(angle);
    double nwX = (x - length / 2 - x) * Math.cos(radians) - (y - height / 2 - y) * Math.sin(radians) + x + paddingX;
    double nwY = (x - length / 2 - x) * Math.sin(radians) + (y - height / 2 - y) * Math.cos(radians) + y + paddingY;
    double neX = (x + length / 2 - x) * Math.cos(radians) - (y - height / 2 - y) * Math.sin(radians) + x + paddingX;
    double neY = (x + length / 2 - x) * Math.sin(radians) + (y - height / 2 - y) * Math.cos(radians) + y + paddingY;
    double swX = (x - length / 2 - x) * Math.cos(radians) - (y + height / 2 - y) * Math.sin(radians) + x + paddingX;
    double swY = (x - length / 2 - x) * Math.sin(radians) + (y + height / 2 - y) * Math.cos(radians) + y + paddingY;
    double seX = (x + length / 2 - x) * Math.cos(radians) - (y + height / 2 - y) * Math.sin(radians) + x + paddingX;
    double seY = (x + length / 2 - x) * Math.sin(radians) + (y + height / 2 - y) * Math.cos(radians) + y + paddingY;

    return new double[]{nwX, nwY, neX, neY, swX, swY, seX, seY};
  }

  public boolean isCollidingTwoPlayers(Player player1, Player player2){

    boolean isColliding = false;
    double player1HitboxArea = player1.getHitboxArea();
    double[] player1HitboxCoordinates = player1.getHitboxCoordinates();
    double[] player2HitboxCoordinates = player2.getHitboxCoordinates();

    for(int i = 0; i < 7 ; i+= 2){

      if(player1HitboxArea >= calculateTotalAreaOfTrianglesBetweenRectangleAndPoint(new double[]{ player1HitboxCoordinates[i], player1HitboxCoordinates[i+1]}, player2HitboxCoordinates)){
        isColliding = true;
        player1.setVelocity(0.00f);
      }
    }

    return isColliding;
  }

  public boolean isCollidingPlayerAndBullet(Bullet bullet, Player player){

    boolean isColliding = false;
    double[] playerHitboxCoordinates = player.getHitboxCoordinates();

    if(player.getHitboxArea() >= calculateTotalAreaOfTrianglesBetweenRectangleAndPoint(this.bulletHitboxPoint(bullet), playerHitboxCoordinates)){
        isColliding = true;
        player.damage(10);
    }

    return isColliding;
  }


  public double calculateTotalAreaOfTrianglesBetweenRectangleAndPoint(double[] point, double[] rectangle){

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

  public double[] bulletHitboxPoint(Bullet bullet){

    return new double[]{ bullet.getX() + Math.sin(Math.toRadians(bullet.getAngle())) * 10, bullet.getY() - Math.cos(Math.toRadians(bullet.getAngle())) * 10};
  }

  public static Hitbox getInstance(){

    if(instance == null)
      instance = new Hitbox();

    return instance;
  }
}
