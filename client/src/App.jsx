import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Sleepy Commissions</p>
          <h1>Affiliate income engine</h1>
        </div>
        <nav className="nav">
          <NavLink to="/">Storefront</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
