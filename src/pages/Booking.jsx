import { useState } from "react";
import { supabase } from "../supabase";
import { isSupabaseTableMissingError, saveStoredBooking } from "../utils/bookingStorage";

const SEAT_CLASS_PRICES = {
  "Business Class": 4200,
  Premium: 2800,
  Economy: 1600,
};

function Booking() {
  const [name, setName] = useState("");
  const [tickets, setTickets] = useState("");
  const [seatClass, setSeatClass] = useState("");
  const [route, setRoute] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const perTicketPrice = seatClass ? SEAT_CLASS_PRICES[seatClass] ?? 0 : 0;
  const totalPrice = seatClass && tickets ? perTicketPrice * Number(tickets) : 0;

  async function handleBooking() {
    if (!name || !tickets || !seatClass || !route) {
      setStatus({ type: "error", message: "Please fill all the details." });
      return;
    }

    const parsedTickets = Number(tickets);

    if (!Number.isFinite(parsedTickets) || parsedTickets < 1) {
      setStatus({ type: "error", message: "Please enter a valid number of tickets." });
      return;
    }

    const bookingData = {
      name: name.trim(),
      tickets: parsedTickets,
      seatClass,
      route,
      pricePerSeat: perTicketPrice,
      totalPrice: perTicketPrice * parsedTickets,
    };

    const { data, error } = await supabase.from("bookings").insert([bookingData]);

    if (error) {
      if (isSupabaseTableMissingError(error)) {
        saveStoredBooking(bookingData);
        console.warn("Supabase bookings table is missing. Booking saved locally.", error);
        setStatus({
          type: "success",
          message: "Tickets booked successfully! Saved locally for now.",
        });
        setName("");
        setTickets("");
        setSeatClass("");
        setRoute("");
        return;
      }

      console.error("Booking insert failed:", error);
      setStatus({ type: "error", message: `Booking failed: ${error.message}` });
      return;
    }

    console.log(data);
    setStatus({ type: "success", message: "Tickets booked successfully!" });
    setName("");
    setTickets("");
    setSeatClass("");
    setRoute("");
  }

  return (
    <main className="booking-page">
      <h1>Book Your Ticket</h1>

      <div className="booking-form">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <label htmlFor="tickets">Number of Tickets</label>
        <input
          id="tickets"
          type="number"
          min="1"
          value={tickets}
          onChange={(e) => setTickets(e.target.value)}
          placeholder="Enter number of tickets"
        />

        <label htmlFor="seatClass">Select Seat Class</label>
        <select id="seatClass" value={seatClass} onChange={(e) => setSeatClass(e.target.value)}>
          <option value="">-- Select Seat Class --</option>
          <option value="Business Class">Business Class - ₹4,200</option>
          <option value="Premium">Premium - ₹2,800</option>
          <option value="Economy">Economy - ₹1,600</option>
        </select>

        <label htmlFor="route">Select Route</label>
        <select id="route" value={route} onChange={(e) => setRoute(e.target.value)}>
          <option value="">-- Select Route --</option>
          <option value="Bengaluru to Srinagar">Bengaluru to Srinagar</option>
          <option value="Bengaluru to Leh">Bengaluru to Leh</option>
          <option value="Bengaluru to Manali">Bengaluru to Manali</option>
          <option value="Bengaluru to Katra">Bengaluru to Katra</option>
          <option value="Bengaluru to Shimla">Bengaluru to Shimla</option>
        </select>

        <button onClick={handleBooking}>Book Ticket</button>

        {status.message && (
          <div className={status.type === "success" ? "success-banner" : "error-banner"}>
            {status.message}
          </div>
        )}
      </div>

      <section className="booking-details">
        <h3>Booking Details</h3>
        <p>
          Name: <strong>{name || "-"}</strong>
        </p>
        <p>
          Tickets: <strong>{tickets || "-"}</strong>
        </p>
        <p>
          Seat Class: <strong>{seatClass || "-"}</strong>
        </p>
        <p>
          Price per Seat: <strong>{seatClass ? `₹${perTicketPrice.toLocaleString("en-IN")}` : "-"}</strong>
        </p>
        <p>
          Total Price: <strong>{totalPrice ? `₹${totalPrice.toLocaleString("en-IN")}` : "-"}</strong>
        </p>
        <p>
          Route: <strong>{route || "-"}</strong>
        </p>
      </section>
    </main>
  );
}

export default Booking;
