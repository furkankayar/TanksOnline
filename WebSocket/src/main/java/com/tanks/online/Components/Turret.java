package com.tanks.online.Components;


public class Turret{

  private double x;
  private double y;
  private int angle;


  public Turret(){

  }

  public void setX(double x){

    this.x = x;
  }

  public void setY(double y){

    this.y = y;
  }

  public void setAngle(int angle){

    this.angle = angle;
  }

  public double getX(){

    return this.x;
  }

  public double getY(){

    return this.y;
  }

  public int getAngle(){

    return this.angle;
  }

}
