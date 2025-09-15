import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ParentalDashboard from './pages/parental-dashboard';
import LoginPage from './pages/login';
import VideoPlayerPage from './pages/video-player';
import VideoGallery from './pages/video-gallery';
import UserRegistration from './pages/user-registration';
import VideoUploadPage from './pages/video-upload';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/parental-dashboard" element={<ParentalDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/video-player" element={<VideoPlayerPage />} />
        <Route path="/video-gallery" element={<VideoGallery />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/video-upload" element={<VideoUploadPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
