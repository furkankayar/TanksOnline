package com.tanks.online.Physics;

public class World{


  private int[] bounds; //World Bounds

  public World(int xs, int ys, int length, int height){

    this.bounds = new int[4];
    this.bounds[0] = xs;
    this.bounds[1] = ys;
    this.bounds[2] = length;
    this.bounds[3] = height;
  }

  public World(){

    this.bounds = new int[4];
  }

  public void setBounds(int xs, int ys, int length, int height){

    this.bounds[0] = xs;
    this.bounds[1] = ys;
    this.bounds[2] = length;
    this.bounds[3] = height;
  }

  public int[] getBounds(){

    return this.bounds.clone();
  }
}
