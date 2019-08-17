package com.tanks.online.Physics;


public class Body{


  private World world;
  protected double x;
  protected double y;
  protected int length;
  protected int height;

  protected float velocity;
  protected float rotation;
  protected int angle;
  private long lastUpdateTime;

  protected int[] worldBounds;

  public Body(World world){

    this.world = world;
    this.worldBounds = world.getBounds();

  }


  public double[] getBounds(){

    return new double[]{this.x, this.y, this.x + this.length , this.y + this.height};
  }

  public void setLocation(double x, double y){

    this.x = x;
    this.y = y;
  }

  public void setSize(int length, int height){

    this.length = length;
    this.height = height;
  }

  public void setAngle(int angle){

    this.angle = angle;
  }

  public void setRotation(float rotation){

    this.rotation = rotation;
  }

  public void setVelocity(float velocity){

    this.velocity = velocity;
  }

  public void setLastUpdateTime(long lastUpdateTime){

    this.lastUpdateTime = lastUpdateTime;
  }

  public int getAngle(){

    return this.angle;
  }

  public double getX(){

    return this.x;
  }

  public long getLastUpdateTime(){

    return this.lastUpdateTime;
  }


  public double getY(){

    return this.y;
  }

  public float getRotation(){

    return this.rotation;
  }

  public float getVelocity(){

    return this.velocity;
  }

  public int getLength(){

    return this.length;
  }

  public int getHeight(){

    return this.height;
  }

  public void velocityFromAngle(){

    double tempX = this.x + Math.sin(Math.toRadians(this.angle)) * this.velocity;
    double tempY = this.y - Math.cos(Math.toRadians(this.angle)) * this.velocity;


    if(tempX > this.worldBounds[0] && tempX < this.worldBounds[0] + this.worldBounds[2]){
      this.x = tempX;
    }

    if(tempY > this.worldBounds[1] && tempY < this.worldBounds[1] + this.worldBounds[3]){
      this.y = tempY;
    }
  }

  public void velocityToPoint(double toX, double toY){

    double angleBetweenPoints = Math.atan(Math.abs(toX - this.x) / Math.abs(toY - this.y)); // HAS TO BE FIXED
    double tempX = this.x + Math.sin(angleBetweenPoints);
    double tempY = this.y + Math.cos(angleBetweenPoints);


    if(tempX > this.worldBounds[0] && tempX + this.length < this.worldBounds[1]){
      this.x = tempX;
    }

    if(tempY > this.worldBounds[2] && tempY + this.height < this.worldBounds[3]){
      this.y = tempY;
    }
  }

  public void rotateRight(){

    this.angle += 3;
  }

  public void rotateLeft(){

    this.angle -= 3;
  }

  public double getTiming(){

    return 16.667; // 1000 / 60 which means 60 frame calculation each second
  }

}
