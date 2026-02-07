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
import Schedule from "../pages/Schedule";
import StudentDashboard from "../pages/StudentDashboard";
import OrganizerEventDetail from "../pages/OrganizerEventDetail";

import StudentLayout from "../components/StudentLayout";
import OrganizerLayout from "../components/OrganizerLayout";
import AdminLayout from "../components/AdminLayout";
import AdminHome from "../pages/admin/AdminHome";
import AdminPendingEvents from "../pages/admin/AdminPendingEvents";
import AdminAllEvents from "../pages/admin/AdminAllEvents";
import AdminOrganizers from "../pages/admin/AdminOrganizers";
import AdminEventDetail from "../pages/admin/AdminEventDetail";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Student Protected Routes */}
      <Route element={<StudentLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/certificates" element={<Certificates />} />
      </Route>

      {/* Organizer Protected Routes */}
      <Route element={<OrganizerLayout />}>
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/events" element={<OrganizerDashboard />} />
        <Route path="/organizer/event/:id" element={<OrganizerEventDetail />} />
        <Route path="/organizer/create" element={<OrganizerDashboard />} />
        <Route path="/organizer/profile" element={<OrganizerDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminHome />} />
        <Route path="/admin/pending" element={<AdminPendingEvents />} />
        <Route path="/admin/events" element={<AdminAllEvents />} />
        <Route path="/admin/organizers" element={<AdminOrganizers />} />
        <Route path="/admin/event/:id" element={<AdminEventDetail />} />
      </Route>

      <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
    </Routes>
  );
}
