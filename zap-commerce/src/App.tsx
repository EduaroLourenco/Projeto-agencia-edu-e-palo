import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Storefront } from "./pages/Storefront";
import { AdminPanel } from "./pages/admin/AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:slug/admin" element={<AdminPanel />} />
        <Route path="/:slug" element={<Storefront />} />
      </Routes>
    </BrowserRouter>
  );
}
