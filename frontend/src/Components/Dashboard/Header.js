
import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './header.css';
import avataricon from '../../images/profile.png';
import { BiNotificationOff } from 'react-icons/bi'

const Header = ({ setLoginUser }) => {

  //localStorage.setItem('currentUser', JSON.stringify(res.data))
  //localStorage.setItem('currentUser', JSON.stringify(res.data))
  var usercurrent = localStorage.getItem('currentUser');
  const logout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = "/";
  }
  return (
    <>
      <Navbar className="nav-header">
        <Container>
          <div className='home-icon'>
          <i class="fa-solid fa-house"></i>
          </div>
     
          <Navbar.Brand href="/">
         
            Home</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
          <div className='notify-icon'>
            <i class="fa-solid fa-bell"></i>
          </div>
            <div className='user-icon'>
              <img src={avataricon} alt="" className="avatar-icon" />
            </div>
            <Navbar.Text>
              <a href="#login">{usercurrent}</a>
            </Navbar.Text>
            <div className='logout-nav' onClick={() => {
              const confirmBox = window.confirm(
                "Are you sure want to logout?"
              )
              if (confirmBox === true) {
                logout()
              }
            }} >Logout</div>
          </Navbar.Collapse>
         
        </Container>
      </Navbar>
    </>
  )
}

export default Header