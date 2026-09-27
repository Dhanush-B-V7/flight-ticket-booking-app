import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RoutesPage from "./pages/routes";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";

function App() {
  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/matches" element={<RoutesPage />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/history" element={<BookingHistory />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
