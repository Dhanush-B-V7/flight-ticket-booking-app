import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { isSupabaseTableMissingError, readStoredBookings } from "../utils/bookingStorage";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  async function getBookings() {
    const { data, error } = await supabase.from("bookings").select("*");

    if (error) {
      if (isSupabaseTableMissingError(error)) {
        setBookings(readStoredBookings());
        return;
      }

      console.error("Booking fetch failed:", error);
      setBookings(readStoredBookings());
      return;
    }

    setBookings(data ?? []);
  }

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <main className="history-page">
      <h1>Booking History</h1>

      <button className="history-button" onClick={getBookings}>
        View Bookings
      </button>

      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tickets</th>
              <th>Seat Class</th>
              <th>Price</th>
              <th>Route</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5">No bookings yet.</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.name}</td>
                  <td>{booking.tickets}</td>
                  <td>{booking.seatClass}</td>
                  <td>
                    {booking.totalPrice != null
                      ? `₹${Number(booking.totalPrice).toLocaleString("en-IN")}`
                      : booking.price != null
                        ? `₹${Number(booking.price).toLocaleString("en-IN")}`
                        : "-"}
                  </td>
                  <td>{booking.route}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default BookingHistory;
