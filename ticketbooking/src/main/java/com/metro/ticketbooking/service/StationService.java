package com.metro.ticketbooking.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class StationService {
    private final Map<String, Integer> stationPrices = new HashMap<>();

    public StationService() {
        loadStations();
    }

    private void loadStations() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getClassLoader().getResourceAsStream("stations.json");
            JsonNode root = mapper.readTree(is).get("stations");
            root.fieldNames().forEachRemaining(fieldName -> {
                String station = fieldName;
                int price = root.get(fieldName).get("price").asInt();
                stationPrices.put(station, price);
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getPrice(String station) {
        return stationPrices.getOrDefault(station, -1);
    }

    public boolean stationExists(String station) {
        return stationPrices.containsKey(station);
    }
}
