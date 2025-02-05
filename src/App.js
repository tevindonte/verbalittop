import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Welcome from "./pages/Welcome";
import Notfound from "./pages/Notfound";
import AnimatedCursor from "react-animated-cursor"
import Moodboard from "./pages/Moodboard";
import Noetebook from "./pages/Notebook";
import Notebook from "./pages/Notebook";
import Calendar from "./pages/Calendar";
import Membership from "./pages/Membership";
import { UserProvider } from '../src/components/UserContext'
import Project from './pages/Project';
import ProjectDetail from "./pages/ProjectDetail";
import { ProjectProvider } from './components/ProjectContext';
import { TaskProvider } from './components/TaskContext';
import Learn from "./components/Learn";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import About from "./pages/About";
import { AuthProvider, AuthContext } from "./components/AuthContext";
import React from 'react';
import CollaborationPage from "./pages/CollaboratePage";
import FolderCollaboration from "./pages/FolderCollaboration";
import CollaborationMoodboardPage from "./pages/CallaborationMoodboardPage";
import Uplift from "./pages/Uplift"

function App() {
  return (
    <div>
      <AuthProvider>

        <AnimatedCursor
          innerSize={13}
          outerSize={13}
          color='255,180,31'
          outerAlpha={0.4}
          innerScale={1.7}
          outerScale={3}
          clickables={[
            'a',
            'input[type="text"]',
            'input[type="email"]',
            'input[type="number"]',
            'input[type="submit"]',
            'input[type="image"]',
            'label[for]',
            'select',
            'textarea',
            'button',
            '.link'
          ]}
        />
        <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} />
          <ProjectProvider>
            <TaskProvider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoutes>
                      <UserProvider>

                        <Home />
                      </UserProvider>
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/moodboard"
                  element={
                    <ProtectedRoutes>
                      <UserProvider>
                        <Moodboard />
                      </UserProvider>
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/uplift"
                  element={
                    <ProtectedRoutes>
                      <UserProvider>
                        <Uplift />
                      </UserProvider>
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/notebook"
                  element={
                    <ProtectedRoutes>
                      <UserProvider>
                        <Notebook />
                      </UserProvider>
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoutes>
                      <UserProvider>
                        <ProjectDetail />
                      </UserProvider>
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoutes>
                      <UserProvider>
                        <Calendar />
                      </UserProvider>
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoutes>
                      <UserProvider>
                        <Project />
                      </UserProvider>
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoutes>
                      <Login />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/membership"
                  element={
                    <ProtectedRoutes>
                      <UserProvider>
                        <Membership />
                      </UserProvider>
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoutes>
                      <Register />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/collaboration/:pageId/:token"
                  element={
                    <PublicRoutes>
                      <UserProvider>
                        <CollaborationPage />
                      </UserProvider>
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/folders/collaborate/:folderId/:token"
                  element={
                    <PublicRoutes>
                      <UserProvider>
                        <FolderCollaboration />
                      </UserProvider>
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/moodboards/collaborate/:moodboardId/:token"
                  element={
                    <PublicRoutes>
                      <CollaborationMoodboardPage />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/welcome"
                  element={
                    <PublicRoutes>
                      <Welcome />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <PublicRoutes>
                      <About />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/learn"
                  element={
                    <PublicRoutes>
                      <Learn />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <PublicRoutes>
                      <TermsConditions />
                    </PublicRoutes>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <PublicRoutes>
                      <PrivacyPolicy />
                    </PublicRoutes>
                  }
                />



                <Route
                  path="/verifyemail/:token"
                  element={
                    <PublicRoutes>
                      <VerifyEmail />
                    </PublicRoutes>
                  }
                />

                <Route
                  path="/resetpassword/:token"
                  element={
                    <PublicRoutes>
                      <ResetPassword />
                    </PublicRoutes>
                  }
                />

                <Route
                  path="/resetpassword/:token"
                  element={
                    <PublicRoutes>
                      <Notfound />
                    </PublicRoutes>
                  }
                />




              </Routes>
            </TaskProvider>
          </ProjectProvider>
        </BrowserRouter>

      </AuthProvider>
    </div>
  );
}

export function ProtectedRoutes({ children }) {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner if desired
  }

  if (user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export function PublicRoutes({ children }) {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner if desired
  }

  if (!user) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}
export default App;
