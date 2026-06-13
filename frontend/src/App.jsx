import { BrowserRouter, Routes, Route } from "react-router-dom";

import AgentPage from "./pages/AgentPage";
import CustomerPage from "./pages/CustomerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/agent" element={<AgentPage />} />

        <Route path="/customer" element={<CustomerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
