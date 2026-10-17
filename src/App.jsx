import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RobotsPolicy from "./components/RobotsPolicy.jsx";
import Landing from "./pages/Landing.jsx";
import Consumer from "./pages/Consumer.jsx";
import Investors from "./pages/Investors.jsx";
import VividaEducational from "./components/VividaEducational.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <RobotsPolicy />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/consumer" element={<Consumer />} />
        <Route path="/research" element={<VividaEducational />} />
        {/* Unlisted: no nav link, noindex, disallowed in robots.txt. */}
        <Route path="/investors" element={<Investors />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
