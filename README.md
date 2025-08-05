# How to Run

## 1. Start Backend (Spring Boot)
```
cd ticketbooking/src/main/java/com/metro/ticketbooking
run TicketbookingApplication.java file
```

Backend runs at: http://localhost:8080


## 2. Start Frontend (React + Vite, built already)
```
cd metro-frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173



metro-ticket-booking/
├── backend/
│   ├── ticketbooking-0.0.1-SNAPSHOT.jar   ← Backend compiled JAR
│   ├── stations.json                      ← Station demo data and prices
│   
├── frontend/
│   └── dist/                              ← Frontend build output (static files)



This is a full-stack metro ticket booking system built with:
  - 🧠 Backend: Spring Boot (Java)
  - 💻 Frontend: React + Vite
  - 🗃️ Data: stations.json (ticket pricing)

API Endpoints (Backend)
  1. POST /api/tickets

Description: Generate a new ticket between two stations

Request Body:

{
  "source": "A",
  "destination": "C"
}
Response:

{
  "ticketId": "a1b2c3d4-1234...",
  "source": "A",
  "destination": "C",
  "price": 15,
  "expiryTime": "2025-08-04T18:23:00"
}

2. POST /api/tickets/{id}/entry

Description: Mark entry using the ticket

  Path Variable: {id} → Ticket ID
  
  Response: Confirmation or error (e.g., already used, expired, etc.)


3. POST /api/tickets/{id}/exit
  Description: Mark exit using the ticket
  
  Path Variable: {id} → Ticket ID
  
  Response: Confirmation or error (e.g., entry not done yet)


Ticket Rules
    A ticket is valid for 18 hours after generation.

    A ticket can be used only twice: once for entry and once for exit.

    A ticket cannot be used for exit unless entry is marked.

    A ticket cannot be reused or used after expiry.


Frontend Features
  ✅ Book Ticket: User selects source & destination, then gets a ticket ID.

  ✅ Mark Entry/Exit: User enters ticket ID and clicks "Entry" or "Exit".

  ✅ Ticket History: All purchased tickets are shown in a table (local only).

  ✅ Persistent History: Ticket details are saved in localStorage.

  Ticket history is retained even after page reload.

✅ Error Handling: Shows user-friendly messages for:

    Expired ticket

    Already entered or exited

    Exit without entry
