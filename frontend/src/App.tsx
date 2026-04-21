import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import RegisterPatient from './pages/RegisterPatient';
import RegisterDentist from './pages/RegisterDentist';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/register/patient' element={<RegisterPatient />} />
        <Route path='/register/dentist' element={<RegisterDentist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
