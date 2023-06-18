
import './App.css';
import Homepage from "./Components/Homepage/Homepage"
import Register from "./Components/Register/Register"
import {
  Routes,
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import { useState, useEffect, Fragment } from 'react';
import UserDashboard from './Components/Dashboard/UserDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import CabDriverDashboard from './Components/Dashboard/CabDriverDashboard';
import Header from './Components/Dashboard/Header';
import DirectionMap from './Components/DirectionMap/DirectionMap';

function App() {

  const [user, setLoginUser] = useState({

  })


  return (
    <div className="App">
  
      <Router>
        <Routes>
        
          <Fragment>
            <Route path="/" element={<Register setLoginUser={setLoginUser}/>}  />
            <Route path="/userdashboard" element={<UserDashboard />}  />
            <Route path="/admindashboard" element={<AdminDashboard />}  />
            <Route path="/cabdriverdashboard" element={<CabDriverDashboard />}  />
            <Route path="/header" element={<Header setLoginUser={setLoginUser} />}  />
            <Route path="/directionmap" element={<DirectionMap />}  />
          </Fragment>
        </Routes>
      </Router>

    </div>
  );
}

export default App;
