import { BrowserRouter, Routes, Route } from "react-router-dom";

import AgentPage from "./pages/AgentPage";
import CustomerPage from "./pages/CustomerPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/agent" element={<AgentPage />} />

        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
