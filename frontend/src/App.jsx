import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Courses from './components/Courses';
import Buy from './components/Buy';
import Purchases from './components/Purchases';
import { Toaster } from 'react-hot-toast';
import Settings from './components/Settings';
import AdminSignup from './admin/AdminSignup';
import AdminLogin from './admin/AdminLogin';
import AllCourses from './admin/AllCourses';
import CreateCourse from './admin/CreateCourse';
import UpdateCourse from './admin/UpdateCourse';
import AdminDashboard from './admin/AdminDashboard';
import AdminSettings from './admin/AdminSettings';

function App() {

  return (
    <div>
      <Routes>
        {/* User Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        
        <Route path='/courses' element={<Courses />} />
        <Route path='/buy/:courseId' element={<Buy />} />
        <Route path='/purchases' element={<Purchases />} />
        <Route path='/settings' element={<Settings/>} />

        {/* Admin Routes */}
        <Route path='/admin/signup' element={<AdminSignup />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard /> } />
        <Route path='/admin/all-courses' element={<AllCourses />} />
        <Route path='/admin/create-course' element={<CreateCourse />} />
        <Route path='/admin/update-course/:courseId' element={<UpdateCourse />} />
        <Route path='/admin/settings' element={<AdminSettings /> }/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App;