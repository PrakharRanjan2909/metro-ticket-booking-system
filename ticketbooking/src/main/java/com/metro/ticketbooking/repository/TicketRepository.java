package com.metro.ticketbooking.repository;

import com.metro.ticketbooking.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, String> {
}
