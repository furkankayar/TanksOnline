package com.tanks.online;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;

import org.glassfish.tyrus.server.Server;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class WebSocketServer {


  public static ArrayList<Player> players = new ArrayList<Player>();


  public static void main( String[] args ){

    runServer();
  }

  public static void runServer(){

    Server server = new Server("localhost", 8080, "/websockets", WebSocket.class);

    try{

      server.start();
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

    for(Player player : players){
      JsonObject playerStatus = new JsonObject();
      playerStatus.addProperty("id", player.getId());
      playerStatus.addProperty("fire", player.getFiring());
      playerStatus.addProperty("bulletNumber", player.getBulletNumber());
      playerStatus.addProperty("coordX", player.getCoordX());
      playerStatus.addProperty("coordY", player.getCoordY());
      playerStatus.addProperty("turretRotation", player.getTurretRotation());
      playerStatus.addProperty("tankRotation", player.getTankRotation());
      playerStatus.addProperty("mouseX", player.getMouseX());
      playerStatus.addProperty("mouseY", player.getMouseY());

      playersStatus.add(playerStatus);
    }

    root.addProperty("playerNumber", players.size());
    root.add("players", playersStatus);

    return root.toString();
  }
}
