package com.tanks.online;

import java.io.IOException;
import java.util.logging.Logger;
import java.util.ArrayList;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.CloseReason.CloseCodes;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@ServerEndpoint(value = "/game")
public class WebSocket{

  private Player player;
  private Logger logger = Logger.getLogger(this.getClass().getName());

  @OnOpen
  public void onOpen(Session session){
    logger.info("Connected " + session.getId());
    player = new Player(session.getId());
    WebSocketServer.players.add(player);
  }

  @OnMessage
  public String onMessage(String message, Session session) {
    //logger.info("Message from client '" + message + "'");

    String[] parts = message.split(";");

    switch (parts[0]) {
      case "quit":
        try {
          session.close(new CloseReason(CloseCodes.NORMAL_CLOSURE, "Game ended"));
        } catch (IOException e) {
          throw new RuntimeException(e);
        } break;

      case "getGameStatus":
        applyChanges(parts[1]);
        return WebSocketServer.getGameStatus();

      case "getPlayerInfo":
        return "{\"connectedPlayerId\":\"" + player.getId() + "\"," +
                 "\"connectedPlayerCoordX\":" + player.getCoordX() + "," +
                 "\"connectedPlayerCoordY\":" + player.getCoordY() + "}";
    }
    return "response";
  }

    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        logger.info(String.format("Session %s closed because of %s", session.getId(), closeReason));
    }


    public void applyChanges(String json){

      JsonObject root = new JsonParser().parse(json).getAsJsonObject();

      if(root.get("isFiring").getAsBoolean()){
        player.setFiring(true);
      }
      else{
        player.setFiring(false);
      }
      player.setCoordX(root.get("coordX").getAsInt());
      player.setCoordY(root.get("coordY").getAsInt());
      player.setTurretRotation(root.get("turretRotation").getAsFloat());
      player.setTankRotation(root.get("tankRotation").getAsFloat());
      player.setMouseX(root.get("mouseX").getAsFloat());
      player.setMouseY(root.get("mouseY").getAsFloat());
      //player.setBulletNumber(root.get("bulletNumber").getAsInt());
    }
}
