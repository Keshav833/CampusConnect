import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Events from "../pages/Events";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import MyEvents from "../pages/MyEvents";
import OrganizerDashboard from "../pages/OrganizerDashboard";
import Notifications from "../pages/Notifications";
import Feedback from "../pages/Feedback";
import EventDetails from "../pages/EventDetails";
import Certificates from "../pages/Certificates";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-events" element={<MyEvents />} />
      <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
    </Routes>
  );
}
