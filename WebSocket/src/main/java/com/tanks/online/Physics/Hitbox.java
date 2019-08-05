package com.tanks.online.Physics;


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

  public static Hitbox getInstance(){

    if(instance == null)
      instance = new Hitbox();

    return instance;
  }
}
