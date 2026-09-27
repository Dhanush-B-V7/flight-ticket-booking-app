import { Link } from "react-router-dom";

function MatchCard(props) {
  return (
    <div className="match-card">
      <h2>{props.route}</h2>
      <p>📍 {props.from} → {props.to}</p>
      <p>📅 {props.date}</p>
      <Link to="/booking" className="match-card-button">
        Book Ticket
      </Link>
    </div>
  );
}

function RoutesPage() {
  return (
    <main className="routes-page">
      <h1>Popular Routes from Bengaluru</h1>

      <div className="routes-grid">
        <MatchCard
          route="Bengaluru → Srinagar"
          from="Bengaluru"
          to="Srinagar"
          date="12 April 2026"
        />

        <MatchCard
          route="Bengaluru → Leh"
          from="Bengaluru"
          to="Leh"
          date="18 April 2026"
        />

        <MatchCard
          route="Bengaluru → Manali"
          from="Bengaluru"
          to="Manali"
          date="22 April 2026"
        />
      </div>
    </main>
  );
}

export default RoutesPage;
