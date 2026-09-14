import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './components/PublicLayout'
import Home from './pages/Home'
import About from './pages/About'
import LoanProducts from './pages/LoanProducts'
import LoanProductDetail from './pages/LoanProductDetail'
import LoanEligibility from './pages/LoanEligibility'
import EMICalculator from './pages/EMICalculator'
import Investor from './pages/Investor'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import CustomerDashboard from './pages/CustomerDashboard'
import InvestorDashboard from './pages/InvestorDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/loans" element={<LoanProducts />} />
          <Route path="/loans/:slug" element={<LoanProductDetail />} />
          <Route path="/eligibility" element={<LoanEligibility />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/invest" element={<Investor />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard/investor" element={<InvestorDashboard />} />

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
