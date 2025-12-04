import { Route, Routes } from 'react-router-dom'
import MobileRegistration from './pages/MobileRegistration';
import OtpVerify from './pages/otpVerify';
import PersonalDetails from './pages/PersonalDetails';
import NomineeDetails from './pages/NomineeDetails';
import BankDetails from './pages/BankDetails';
import DocumentUpload from './pages/DocumentUpload';
import Preview from './pages/Preview';
import Success from './pages/Success';

function App() {

  return (
    <Routes>
      <Route path='/' element={<MobileRegistration/>}/>
      <Route path='/verify-otp' element={<OtpVerify/>} />
      <Route path='/personal' element={<PersonalDetails/>} />
      <Route path='/nominee' element={<NomineeDetails/>} />
      <Route path='/bank' element={<BankDetails/>} />
      <Route path='/documents' element={<DocumentUpload/>} />
      <Route path='/preview' element={<Preview/>} />
      <Route path='/success' element={<Success/>} />
    </Routes>
  )
}

export default App
