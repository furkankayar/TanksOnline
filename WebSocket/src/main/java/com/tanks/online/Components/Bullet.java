package com.tanks.online.Components;

import com.tanks.online.Physics.Body;
import com.tanks.online.Physics.World;

public class Bullet extends Body{

  private int id;

  public Bullet(World world, int angle, int id, double x, double y){

    super(world);
    this.angle = angle;
    this.id = id;
    this.x = x;
    this.y = y;
    this.velocity = 8;
  }


  public int getId(){

    return this.id;
  }

  public void setId(int id){

    this.id = id;
  }

  @Override
  public void velocityFromAngle(){

    this.x +=  Math.sin(Math.toRadians(this.angle)) * 3;
    this.y -= Math.cos(Math.toRadians(this.angle)) * 3;

  }
}
