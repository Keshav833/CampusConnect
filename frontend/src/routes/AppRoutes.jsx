import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Events from "../pages/Events";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import RoleSelection from "../pages/RoleSelection";
import AuthChoice from "../pages/AuthChoice";
import Profile from "../pages/Profile";
import MyEvents from "../pages/MyEvents";
import OrganizerDashboard from "../pages/OrganizerDashboard";
import Notifications from "../pages/Notifications";
import Feedback from "../pages/Feedback";
import EventDetails from "../pages/EventDetails";
import Certificates from "../pages/Certificates";

import StudentLayout from "../components/StudentLayout";
import OrganizerLayout from "../components/OrganizerLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/auth-choice" element={<AuthChoice />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Student Protected Routes */}
      <Route element={<StudentLayout />}>
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/certificates" element={<Certificates />} />
      </Route>

      {/* Organizer Protected Routes */}
      <Route element={<OrganizerLayout />}>
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/events" element={<OrganizerDashboard />} /> {/* Placeholder to avoid 404 */}
        <Route path="/organizer/create" element={<OrganizerDashboard />} /> {/* Placeholder to avoid 404 */}
        <Route path="/organizer/profile" element={<OrganizerDashboard />} /> {/* Placeholder to avoid 404 */}
      </Route>

      <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
    </Routes>
  );
}
