import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AppRoutes />
      </div>
    </Router>
  )
}
export default App
