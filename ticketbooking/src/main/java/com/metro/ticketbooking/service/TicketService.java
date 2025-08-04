package com.metro.ticketbooking.service;

import com.metro.ticketbooking.model.Ticket;
import com.metro.ticketbooking.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepo;

    @Autowired
    private StationService stationService;

    public Ticket createTicket(String source, String destination) {
        if (!stationService.stationExists(source) || !stationService.stationExists(destination)) {
            throw new IllegalArgumentException("Invalid station");
        }

        int price = Math.abs(stationService.getPrice(destination) - stationService.getPrice(source));
        Ticket ticket = new Ticket(source, destination, price);
        return ticketRepo.save(ticket);
    }

    public String useTicket(String ticketId, String action) {
        Optional<Ticket> optional = ticketRepo.findById(ticketId);
        if (optional.isEmpty()) return "Ticket not found";

        Ticket ticket = optional.get();

        // Expiry check
        if (Duration.between(ticket.getCreatedAt(), LocalDateTime.now()).toHours() >= 18) {
            return "Ticket expired";
        }

        if ("entry".equalsIgnoreCase(action)) {
            if (ticket.isEntered()) return "Already used for entry";
            ticket.setEntered(true);
        } else if ("exit".equalsIgnoreCase(action)) {
            if (!ticket.isEntered()) return "Cannot exit without entry";
            if (ticket.isExited()) return "Already used for exit";
            ticket.setExited(true);
        } else {
            return "Invalid action";
        }

        ticketRepo.save(ticket);
        return "Ticket " + action + " marked";
    }
}
