import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const STATION_LIST = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
];

function App() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [ticket, setTicket] = useState(() => {
    const savedTicket = localStorage.getItem("ticket");
    return savedTicket ? JSON.parse(savedTicket) : null;
  });
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [ticketHistory, setTicketHistory] = useState(() => {
    const savedHistory = localStorage.getItem("ticketHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const buyTicket = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/tickets/buy`,
        null,
        { params: { source, destination } }
      );
      setTicket(response.data);
      localStorage.setItem("ticket", JSON.stringify(response.data));
      const updatedHistory = [response.data, ...ticketHistory];
      setTicketHistory(updatedHistory);
      localStorage.setItem("ticketHistory", JSON.stringify(updatedHistory));
      setError("");
      setActionMessage("");
    } catch (err) {
      setError(err.response?.data || "Failed to buy ticket");
      setTicket(null);
    }
  };

  const handleTicketAction = async (action) => {
    if (!ticket) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/tickets/use`,
        null,
        { params: { ticketId: ticket.id, action } }
      );
      setActionMessage(response.data);
      setError("");
      if (action === "entry") setTicket({ ...ticket, entered: true });
      if (action === "exit") setTicket({ ...ticket, exited: true });
    } catch (err) {
      setError(err.response?.data || "Error using ticket");
      setActionMessage("");
    }
  };

  const markEntry = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/tickets/use`,
        null,
        { params: { ticketId: id, action: "entry" } }
      );
      alert(`✅ Entry marked for Ticket ${id}: ${response.data}`);
    } catch (error) {
      alert(`❌ ${error.response?.data || "Error marking entry."}`);
    }
  };

  const markExit = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/tickets/use`,
        null,
        { params: { ticketId: id, action: "exit" } }
      );
      alert(`✅ Exit marked for Ticket ${id}: ${response.data}`);
    } catch (error) {
      alert(`❌ ${error.response?.data || "Error marking exit."}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🎫 Metro Ticket Booking</h2>

      <div className="card p-4 shadow mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Source Station</label>
            <select
              className="form-select"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="">--Select--</option>
              {STATION_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Destination Station</label>
            <select
              className="form-select"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">--Select--</option>
              {STATION_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary mt-3 w-100"
          onClick={buyTicket}
          disabled={!source || !destination || source === destination}
        >
          Buy Ticket
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>

      {ticket && (
        <div className="card shadow p-4 mb-4">
          <h4>🎟️ Ticket Details</h4>
          <p>
            <strong>ID:</strong> {ticket.id}
          </p>
          <p>
            <strong>From:</strong> {ticket.source}
          </p>
          <p>
            <strong>To:</strong> {ticket.destination}
          </p>
          <p>
            <strong>Price:</strong> ₹{ticket.price}
          </p>
          <p>
            <strong>Created At:</strong> {ticket.createdAt.replace("T", " ")}
          </p>
          <p>
            <strong>Entered:</strong> {ticket.entered ? "✅" : "❌"}
          </p>
          <p>
            <strong>Exited:</strong> {ticket.exited ? "✅" : "❌"}
          </p>

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => handleTicketAction("entry")}
              disabled={ticket.entered}
            >
              Mark Entry
            </button>
            <button
              className="btn btn-outline-success"
              onClick={() => handleTicketAction("exit")}
              disabled={!ticket.entered || ticket.exited}
            >
              Mark Exit
            </button>
          </div>

          {actionMessage && (
            <div className="alert alert-success mt-3">{actionMessage}</div>
          )}
        </div>
      )}

      <h4 className="mb-3">📜 Ticket History</h4>

      {ticketHistory.length === 0 ? (
        <p className="text-muted">No previous tickets found.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {ticketHistory.map((t) => (
            <div key={t.id} className="col">
              <div className="card h-100 shadow-sm p-3">
                <h5>Ticket ID: {t.id}</h5>
                <p>
                  <strong>From:</strong> {t.source}
                </p>
                <p>
                  <strong>To:</strong> {t.destination}
                </p>
                <p>
                  <strong>Price:</strong> ₹{t.price}
                </p>
                <p>
                  <strong>Created:</strong> {t.createdAt.replace("T", " ")}
                </p>

                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => markEntry(t.id)}
                  >
                    Mark Entry
                  </button>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => markExit(t.id)}
                  >
                    Mark Exit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {ticketHistory.length > 0 && (
        <button
          className="btn btn-danger mt-4 w-100"
          onClick={() => {
            setTicket(null);
            setTicketHistory([]);
            localStorage.removeItem("ticket");
            localStorage.removeItem("ticketHistory");
          }}
        >
          Clear Ticket History
        </button>
      )}
    </div>
  );
}

export default App;
