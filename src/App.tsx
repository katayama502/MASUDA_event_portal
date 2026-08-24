import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MobileNav } from "./components/MobileNav";
import { TopPage } from "./pages/TopPage";
import { ContinuousPage } from "./pages/ContinuousPage";
import { CalendarPage } from "./pages/CalendarPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { OrganizerPage } from "./pages/OrganizerPage";
import { PostFormPage } from "./pages/PostFormPage";
import { GuidePage } from "./pages/GuidePage";
import { AboutPage } from "./pages/AboutPage";
import { OrganizerDashboardPage } from "./pages/OrganizerDashboardPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/continuous" element={<ContinuousPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/organizers/:id" element={<OrganizerPage />} />
          <Route path="/post" element={<PostFormPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/mypage" element={<OrganizerDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
