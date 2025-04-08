import React, { useEffect, lazy, Suspense } from 'react';
import './index.css';
const Navbar = lazy(() => import('./components/Navbar'));
import { Routes, Route, Navigate } from 'react-router-dom';

// const HomePage = lazy(() => import('./Pages/HomePage'));
// const SignUpPage = lazy(()=>import( './Pages/SignUpPage'));
// const LoginPage  = lazy(()=>import('./Pages/LoginPage'  ));         
// const SettingPage= lazy (()=>import('./Pages/SettingPage'));
// const ProfilePage = lazy(()=>import('./Pages/ProfilePage'));

import HomePage from './Pages/HomePage';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import SettingPage from './Pages/SettingPage';
import ProfilePage from './Pages/ProfilePage';



import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'


// const fallBackLoader = ()=>{
//    return( <div className='flex items-center justify-center h-screen'>
//       <Loader className='size-10 animate-spin'></Loader>
//    </div>
//    );
// }


function App() {
   const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
   const { theme } = useThemeStore();

   console.log({ onlineUsers });



   useEffect(() => {
      checkAuth();
   }, [checkAuth])

   console.log({ authUser });

   if (isCheckingAuth && !authUser) return (
      <div className='flex items-center justify-center h-screen'>
         <Loader className="size-10 animate-spin" />
      </div>
   )

   return (
      <div data-theme={theme}>

         <div >

            <Navbar />
            <Routes>
               <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
               <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
               <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
               <Route path='/settings' element={<SettingPage />} />
               <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            </Routes>
            <Toaster />
         </div>

      </div>
   );
}

export default App;
