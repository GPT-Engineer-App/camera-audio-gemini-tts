import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import PreflightCheck from "./pages/PreflightCheck.jsx";
import Navigation from "./components/Navigation.jsx";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/preflight" element={<PreflightCheck />} />
      </Routes>
    </Router>
  );
}

export default App;
