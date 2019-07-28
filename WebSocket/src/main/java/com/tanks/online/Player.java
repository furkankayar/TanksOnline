package com.tanks.online;


public class Player{


  public static final int DEFAULT_BULLET_NUMBER = 1000;

  private String id;
  private String data;
  private boolean firing;
  private int bulletNumber;
  private float turretRotation;
  private float tankRotation;
  private int coordX;
  private int coordY;
  private float mouseX;
  private float mouseY;

  public Player(String id){

    this.id = id;
    this.firing = false;
    this.bulletNumber = DEFAULT_BULLET_NUMBER;
    this.coordX = (int)(Math.random() * 300) - 300;
    this.coordY = (int)(Math.random() * 300) - 300;
  }

  public Player(String id, int bulletNumber){

    this.id = id;
    this.firing = false;
    this.bulletNumber = bulletNumber;
  }

  public float getMouseX(){

    return this.mouseX;
  }

  public float getMouseY(){

    return this.mouseY;
  }

  public float getTurretRotation(){

    return this.turretRotation;
  }

  public float getTankRotation(){

    return this.tankRotation;
  }

  public int getCoordX(){

    return this.coordX;
  }

  public int getCoordY(){

    return this.coordY;
  }

  public String getData(){

    return this.data;
  }

  public String getId(){

    return this.id;
  }

  public int getBulletNumber(){

    return this.bulletNumber;
  }

  public boolean getFiring(){

    return this.firing;
  }

  public void setMouseX(float mouseX){

    this.mouseX = mouseX;
  }

  public void setMouseY(float mouseY){

    this.mouseY = mouseY;
  }

  public void setTurretRotation(float turretRotation){

    this.turretRotation = turretRotation;
  }

  public void setTankRotation(float tankRotation){

    this.tankRotation = tankRotation;
  }

  public void setCoordX(int coordX){

    this.coordX = coordX;
  }

  public void setCoordY(int coordY){

    this.coordY = coordY;
  }

  public void setData(String data){

    this.data = data;
  }

  public void setFiring(Boolean firing){
    this.firing = firing;
  }

  public void setBulletNumber(int bulletNumber){

    this.bulletNumber = bulletNumber;
  }


}
