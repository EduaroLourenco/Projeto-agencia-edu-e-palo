import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Storefront } from "./pages/Storefront";

const AdminPanel = lazy(() =>
  import("./pages/admin/AdminPanel").then((m) => ({ default: m.AdminPanel })),
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/:slug/admin"
          element={
            <Suspense fallback={null}>
              <AdminPanel />
            </Suspense>
          }
        />
        <Route path="/:slug" element={<Storefront />} />
      </Routes>
    </BrowserRouter>
  );
}
