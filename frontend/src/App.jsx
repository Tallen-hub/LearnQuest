import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

import LandingPage from "./pages/LandingPage/LandingPage";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import TutorHomePage from "./pages/TutorHomePage/TutorHomePage.jsx";



function App() {
    return (
      <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/tutor-home/:id" element={<TutorHomePage />} />
          
        </Routes>
      </Router> 
      </ChakraProvider>
  )
}

export default App
