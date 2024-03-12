import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateProfile from "./components/profile/CreateEditProfile";
import PorfilesList from "./pages/PorfilesList";
import MyFooter from "./components/Footer";
import { CookiesProvider } from 'react-cookie';
import ForgotPassword from "./pages/ForgotPassword";
import EditViewProfile from "./pages/EditViewProfile";
import Stepper from "./pages/Stepper";
import ContactUs from "./pages/ContactUs";
import AdminDashBoard from "./pages/AdminDashBoard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-w-full min-h-screen 
      bg-cover bg-center
      bg-[linear-gradient(to_right_bottom,rgba(5,5,5,0.5),rgba(5,5,5,0.5)),url('https://images.pexels.com/photos/12432460/pexels-photo-12432460.jpeg?auto=compress&cs=tinysrgb&w=800')]
      
      md:bg-[linear-gradient(to_right_bottom,rgba(5,5,5,0.5),rgba(5,5,5,0.5)),url('https://images.pexels.com/photos/4121047/pexels-photo-4121047.jpeg?auto=compress&cs=tinysrgb&w=800')]
      
      lg:bg-[linear-gradient(to_right_bottom,rgba(5,5,5,0.5),rgba(5,5,5,0.5)),url('https://images.pexels.com/photos/13873241/pexels-photo-13873241.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')]
      
      dark:bg-[linear-gradient(to_right_bottom,rgba(5,5,5,0.8),rgba(5,5,5,0.8)),url('https://images.pexels.com/photos/12432460/pexels-photo-12432460.jpeg?auto=compress&cs=tinysrgb&w=800')]

      dark:md:bg-[linear-gradient(to_right_bottom,rgba(5,5,5,0.8),rgba(5,5,5,0.8)),url('https://images.pexels.com/photos/4121047/pexels-photo-4121047.jpeg?auto=compress&cs=tinysrgb&w=800')]
      
      dark:lg:bg-[linear-gradient(to_right_bottom,rgba(5,5,5,0.8),rgba(5,5,5,0.8)),url('https://images.pexels.com/photos/13873241/pexels-photo-13873241.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')]"
      >
          <Header></Header>
          <Routes>
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/stepper" element={<Stepper />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<PrivateRoute />}>
              <Route path="/about" element={<About />} />

              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/adminDashboard" element={<AdminDashBoard />} />
              <Route path="/profile/:id" element={<EditViewProfile />} />
              <Route path="/createProfile" element={<CreateProfile />} />
              <Route path="/viewProfiles" element={<PorfilesList />}/>
              

            </Route>
          </Routes>
          <MyFooter></MyFooter>
        </div>
    </BrowserRouter>
  );
}
