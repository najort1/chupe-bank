package com.nuhcorre.chupebankbackend.service;

import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class RoomService {

    private final Map<String, Set<String>> roomToUsers = new HashMap<>();

    public String createRoom(String user1) {
        String roomHash = UUID.randomUUID().toString();
        roomToUsers.put(roomHash, new HashSet<>(Arrays.asList(user1)));
        return roomHash;
    }

    public String userJoinRoom(String roomHash, String user) {
        Set<String> users = roomToUsers.get(roomHash);
        if (users == null) {
            users = new HashSet<>();
            roomToUsers.put(roomHash, users);
        }
        users.add(user);
        return roomHash;
    }

    public boolean isValidRoom(String roomHash, String userId) {
        Set<String> users = roomToUsers.get(roomHash);
        return users != null && users.contains(userId);
    }


}
