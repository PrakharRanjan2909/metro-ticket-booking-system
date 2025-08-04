package com.metro.ticketbooking.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;


@Data
@Entity
public class Ticket {

    @Id
    private String id;

    private String source;
    private String destination;
    private int price;

    private boolean entered;
    private boolean exited;

    private LocalDateTime createdAt;

    public Ticket() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.entered = false;
        this.exited = false;
    }

    public Ticket(String source, String destination, int price) {
        this();
        this.source = source;
        this.destination = destination;
        this.price = price;
    }

    // Getters and Setters (or use Lombok @Data)
}
