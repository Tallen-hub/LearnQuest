import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

import LandingPage from "./pages/LandingPage/LandingPage";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import TutorHomePage from "./pages/TutorHomePage/TutorHomePage.jsx";
import StudentHomePage from "./pages/StudentHomePage/StudentHomePage.jsx";
import StudentProfilePage from "./components/StudentHomePage/StudentProfilePage"; // Make sure the path is correct
import TutorProfilePage from "./components/TutorHomePage/TutorProfilePage";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/tutor-home/:id" element={<TutorHomePage />} />
          <Route path="/student-home/:id" element={<StudentHomePage />} />
          <Route path="/student-profile/:id" element={<StudentProfilePage />} />
          <Route path="/tutor-profile/:id" element={<TutorProfilePage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;