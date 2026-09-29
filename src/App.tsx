import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import CoursePage from './components/CoursePage';
import CertificateVerification from './components/CertificateVerification';
import QuantumPage from './components/QuantumPage';
import ProgramPage from './components/ProgramPage';
import BiologicsPage from './components/BiologicsPage';
import BecomeTrainerPage from './components/BecomeTrainerPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage onStart={() => window.location.href = '/login'} onCourseClick={(id) => window.location.href = `/course/${id}`} />} />
        <Route path="/become-trainer" element={<BecomeTrainerPage />} />
        <Route path="/login" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quantum" element={<QuantumPage />} />
        <Route path="/fde" element={<ProgramPage />} />
        <Route path="/biologics" element={<BiologicsPage />} />
        <Route path="/drug-discovery" element={<BiologicsPage />} />
        <Route path="/course/:courseId" element={<CoursePageWrapper />} />
        <Route path="/verify" element={<CertificateVerification />} />
        <Route path="/verify/:id" element={<CertificateVerification />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Wrapper to handle props for CoursePage with Router params
import { useParams, useNavigate } from 'react-router-dom';

const CoursePageWrapper = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  return (
    <CoursePage
      courseId={courseId || 'python-ai-course'}
      onBack={() => navigate('/')}
      onBuy={() => navigate('/dashboard')}
    />
  );
};

export default App;
