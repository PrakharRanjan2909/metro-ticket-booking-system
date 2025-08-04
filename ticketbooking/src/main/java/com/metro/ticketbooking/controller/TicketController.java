package com.metro.ticketbooking.controller;

import com.metro.ticketbooking.model.Ticket;
import com.metro.ticketbooking.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/buy")
    public ResponseEntity<Ticket> buyTicket(
            @RequestParam String source,
            @RequestParam String destination) {
        Ticket ticket = ticketService.createTicket(source, destination);
        return ResponseEntity.ok(ticket);
    }

    @PostMapping("/use")
    public ResponseEntity<String> useTicket(
            @RequestParam String ticketId,
            @RequestParam String action) {
        String result = ticketService.useTicket(ticketId, action);

        if ("Ticket not found".equals(result)) {
            return ResponseEntity
                    .status(404)
                    .body(result);
        }

        if (result.startsWith("Cannot") || result.startsWith("Already") || result.startsWith("Ticket expired")) {
            return ResponseEntity
                    .badRequest()
                    .body(result);
        }

        return ResponseEntity.ok(result);
    }
}
