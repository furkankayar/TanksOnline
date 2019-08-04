package com.tanks.online;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;

import org.glassfish.tyrus.server.Server;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

import com.tanks.online.Components.Player;
import com.tanks.online.Components.Bullet;

public class WebSocketServer {


  public static ArrayList<Player> players = new ArrayList<Player>();
  public static com.tanks.online.Physics.Engine physicsEngine = new com.tanks.online.Physics.Engine();

  public static void main( String[] args ){

    runServer();

  }

  public static void runServer(){

    Server server = new Server("localhost", 8080, "/websockets", WebSocket.class);

    try{

      server.start();
      physicsEngine.start();
      BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
      System.out.print("Press a key to stop the server.");
      reader.readLine();
    }
    catch (Exception e){
      System.out.println("err");
    }
    finally{
      server.stop();
    }
  }

  public static String getGameStatus(){

    JsonObject root = new JsonObject();
    JsonArray playersStatus = new JsonArray();
    JsonArray firedBullets = new JsonArray();

    for(Player player : players){
      JsonObject playerStatus = new JsonObject();
      playerStatus.addProperty("id", player.getId());
      playerStatus.addProperty("positionX", player.getX());
      playerStatus.addProperty("positionY", player.getY());
      playerStatus.addProperty("mouseX", player.getMouseX());
      playerStatus.addProperty("mouseY", player.getMouseY());
      playerStatus.addProperty("angle", player.getAngle());
      playerStatus.addProperty("turretAngle", player.getTurretAngle());


      for(Bullet bullet : player.getFiredBullets()){
        JsonObject bulletStatus = new JsonObject();
        bulletStatus.addProperty("x", bullet.getX());
        bulletStatus.addProperty("y", bullet.getY());
        bulletStatus.addProperty("angle", bullet.getAngle());
        firedBullets.add(bulletStatus);
      }

      playersStatus.add(playerStatus);
    }

    root.addProperty("playerNumber", players.size());
    root.add("players", playersStatus);
    root.add("bullets", firedBullets);

    return root.toString();
  }
}
