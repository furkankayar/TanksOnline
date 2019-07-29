package com.tanks.online;

import com.tanks.online.Physics.Body;
import com.tanks.online.Physics.Engine;

public class Player extends Body{


  public static final int DEFAULT_BULLET_NUMBER = 1000;

  private String id;
  private String data;

  private boolean firing;
  private boolean accelerating;
  private boolean rotatingLeft;
  private boolean rotatingRight;

  private int bulletNumber;
  private int turretAngle;

  private float mouseX;
  private float mouseY;


  public Player(String id, Engine engine){

    super(engine.getWorld());
    this.id = id;
    this.firing = false;
    this.bulletNumber = DEFAULT_BULLET_NUMBER;

    com.tanks.online.WebSocketServer.physicsEngine.addBodyToEngine(this);
    this.setSize(100, 100);
    this.setLocation(Math.random() * 300, Math.random() * 300);

  }

  public float getMouseX(){

    return this.mouseX;
  }

  public float getMouseY(){

    return this.mouseY;
  }

  public float getTurretAngle(){

    return this.turretAngle;
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

  public boolean isAccelerating(){

    return this.accelerating;
  }

  public boolean isRotatingLeft(){

    return this.rotatingLeft;
  }

  public boolean isRotatingRight(){

    return this.rotatingRight;
  }


  public void setMouseX(float mouseX){

    this.mouseX = mouseX;
  }

  public void setMouseY(float mouseY){

    this.mouseY = mouseY;
  }


  public void setData(String data){

    this.data = data;
  }

  public void setFiring(Boolean firing){
    this.firing = firing;
  }

  public void setAccelerating(Boolean accelerating){
    this.accelerating = accelerating;
  }

  public void setRotatingLeft(Boolean rotatingLeft){
    this.rotatingLeft = rotatingLeft;
  }

  public void setRotatingRight(Boolean rotatingRight){
    this.rotatingRight = rotatingRight;
  }

  public void setBulletNumber(int bulletNumber){

    this.bulletNumber = bulletNumber;
  }

  public void setTurretAngle(int turretAngle){

    this.turretAngle = turretAngle;
  }


}
