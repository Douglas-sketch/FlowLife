import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { GamificationProvider } from "./context/GamificationContext";
import { AppShell } from "./components/AppShell";
import { Toaster } from "./components/Toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Splash from "./screens/Splash";
import Onboarding from "./screens/Onboarding";
import Auth from "./screens/Auth";
import BloodSetup from "./screens/BloodSetup";
import AppLayout from "./screens/AppLayout";
import Home from "./screens/Home";
import Compatibility from "./screens/Compatibility";
import Centers from "./screens/Centers";
import Schedule from "./screens/Schedule";
import Rewards from "./screens/Rewards";
import Profile from "./screens/Profile";
import Achievements from "./screens/Achievements";
import Notifications from "./screens/Notifications";
import Assistant from "./screens/Assistant";
import Settings from "./screens/Settings";
import About from "./screens/About";

export default function App() {
  return (
    <AccessibilityProvider>
      <GamificationProvider>
        <AuthProvider>
          <HashRouter>
            <AppShell>
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/setup-blood"
                  element={
                    <ProtectedRoute>
                      <BloodSetup />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />

                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="home" element={<Home />} />
                  <Route path="compatibility" element={<Compatibility />} />
                  <Route path="centers" element={<Centers />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="rewards" element={<Rewards />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="achievements" element={<Achievements />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="assistant" element={<Assistant />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
              <Toaster />
            </AppShell>
          </HashRouter>
        </AuthProvider>
      </GamificationProvider>
    </AccessibilityProvider>
  );
}
