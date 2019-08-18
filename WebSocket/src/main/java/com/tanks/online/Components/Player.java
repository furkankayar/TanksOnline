package com.tanks.online.Components;

import com.tanks.online.Physics.Body;
import com.tanks.online.Physics.Engine;
import com.tanks.online.Physics.Hitbox;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

public class Player extends Body{


  public static final int DEFAULT_BULLET_NUMBER = 1000;

  private String id;
  private String data;

  private boolean firing;
  private boolean accelerating;
  private boolean rotatingLeft;
  private boolean rotatingRight;
  private boolean alive;

  private int bulletNumber;
  private int fireRate;
  private float maxVelocity;
  private long nextFire;

  private int health;
  private Turret turret;

  private float mouseX;
  private float mouseY;

  private Engine engine;
  private Hitbox hitbox;
  private List<Bullet> firedBullets;

  public Player(String id, Engine engine){

    super(engine.getWorld());
    this.engine = engine;
    this.hitbox = Hitbox.getInstance();
    this.turret = new Turret();
    this.id = id;
    this.firing = false;
    this.fireRate = 100;
    this.health = 100;
    this.alive = true;
    this.velocity = 0.00f;
    this.maxVelocity = 10.00f;
    this.bulletNumber = DEFAULT_BULLET_NUMBER;
    this.firedBullets = Collections.synchronizedList(new ArrayList<Bullet>());
    com.tanks.online.WebSocketServer.physicsEngine.addBodyToEngine(this);
    this.setSize(75, 120);
    this.setLocation(Math.random() * 500, Math.random() * 500);

  }

  public float getMouseX(){

    return this.mouseX;
  }

  public float getMouseY(){

    return this.mouseY;
  }

  public Turret getTurret(){

    return this.turret;
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

  public double getHitboxArea(){

    return this.length * this.height;
  }

  public boolean isFiring(){

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

  public boolean isAlive(){

    return this.alive;
  }

  public int getHealth(){

    return this.health;
  }


  public double[] getHitboxCoordinates(){

    return this.hitbox.getCornerPositions(this.x, this.y, this.length, this.height, this.angle, -4, -28);
  }

  public void fireBullet(){

    if(this.bulletNumber > 0 && System.currentTimeMillis() > this.nextFire){
      this.nextFire = System.currentTimeMillis() + this.fireRate;
      Bullet bullet = new Bullet(this.engine.getWorld(), this.turret.getAngle(), this.bulletNumber--, this.turret.getX() + Math.sin(Math.toRadians(this.turret.getAngle())) * 100, this.turret.getY() - Math.cos(Math.toRadians(this.turret.getAngle())) * 100);
      firedBullets.add(bullet);
    }
  }

  public void fixTurret(){

    this.turret.setAngle((int)(Math.toDegrees(Math.atan2(this.mouseY - this.turret.getY(), this.mouseX - this.turret.getX()))) + 90);
    turret.setX(this.x - 20 * Math.sin(Math.toRadians(this.angle)));
    turret.setY(this.y + 20 * Math.cos(Math.toRadians(this.angle)));
  }

  public List<Bullet> getFiredBullets(){

    return this.firedBullets;
  }

  public void addFiredBullet(Bullet bullet){

    this.firedBullets.add(bullet);
  }

  public void removeFiredBullet(Bullet bullet){

    this.firedBullets.remove(bullet);
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
    if(accelerating){
      if(this.velocity < this.maxVelocity)
        this.velocity += 0.10f;
    }
    else{
      if(this.velocity > 0.01f)
        this.velocity -= 0.10f;
    }
  }

  public void setReverseAccelerating(Boolean accelerating){
    this.accelerating = accelerating;
    if(accelerating){
      if(this.velocity > -1 * this.maxVelocity)
        this.velocity -= 0.10f;
    }
    else{
      if(this.velocity < -0.01f)
        this.velocity += 0.10f;
    }
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

  public void setAlive(boolean alive){

    this.alive = alive;
  }

  public void damage(int value){

    this.health -= value;
    if(this.health <= 0){
      this.alive = false;
    }
  }

}
