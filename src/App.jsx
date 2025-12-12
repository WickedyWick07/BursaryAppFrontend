import './App.css'
import './index.css';
import LandingPage from './components/LandingPage';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import BursaryProviders from './components/BursaryProviders';
import DetailsInput from './components/DetailsInput';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import VerificationModal from './components/VerificationModal';
import Admin from './components/Admin'
import ViewDetails from './components/ViewDetails';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <BrowserRouter>
    <AuthProvider> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bursary-providers" element={<BursaryProviders />} />
        <Route path="/academic-details" element={<DetailsInput />} /> 
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verification" element={<VerificationModal />} />
        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/user-details" element={<ViewDetails />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
    </>
  )
}

export default App
