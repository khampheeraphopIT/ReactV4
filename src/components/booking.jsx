import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from '@mui/material';
import '../assets/css/Sidebar.css'
import Sidebar from '../components/sidebar'
import Logo from '../assets/images/logo.jpg'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Booking() {
  const MySwal = withReactContent(Swal)
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
  const [inputs, setInputs] = useState({});
  const [user, setUser] = useState()
  const [isLoaded, setIsLoaded] = useState();
  const location = useLocation();
  const { room } = location.state || {};

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(values => ({ ...values, [name]: value }));
  };

  function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }


  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const bookingNumber = generateRandomString(8);

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const token = localStorage.getItem('token');
    if (token) {
      myHeaders.append('Authorization', `Bearer ${token}`);
    }

    const raw = JSON.stringify({
      bookingNumber,
      roomId: room.NumberOfRooms,
      checkIn: inputs.checkIn,
      checkOut: inputs.checkOut,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('http://localhost:3333/booking', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUser(result.user)
        setIsLoaded(false);
        if (result.status === 'ok') {
          MySwal.fire({
            title: 'booking success',
            icon: 'success',
            confirmButtonText: 'Booking details'
          }).then(() => {
            localStorage.setItem('token', result.accessToken);
            navigate('/profile');
          });
        } else {
          MySwal.fire({
            title: 'booking failure',
            icon: 'error',
          });
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="sub-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <ul className="info">
                <li><i className="fa fa-envelope"></i> rsvn@baraliresort.com</li>
                <li><i className="fa fa-map"></i> Barali Beach Resort 10240</li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-4">
              <ul className="social-links">
                <li><Link to="https://www.facebook.com/baraliresort/?locale=th_TH"><i className="fab fa-facebook"></i></Link></li>
                <li><Link to="https://www.instagram.com/barali_beach_resort/"><i className="fab fa-instagram"></i></Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <a href="/" className="logo">
                  <img src={Logo} alt="" />
                </a>
                <ul className="nav">
                  <li><Link to="/Profile" className="active">Home</Link></li>
                  <li><Link to="/SearchRoom">Search Room</Link></li>
                  <li><Link to="/Contact">Contact Us</Link></li>
                  <li><Link to="/RoomDetails"><i className="fa fa-calendar"></i><span>Book Now</span></Link></li>
                  {isLoggedIn && user ? (
                    <li>
                      <Avatar
                        src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'default-image-url'}
                        alt={user?.id || "User Avatar"}
                        onClick={handleSidebarToggle}
                      />
                    </li>
                  ) : (
                    <li>
                      <button onClick={handleSidebarToggle}>
                        <Avatar src={'default-image-url'} />
                      </button>
                    </li>
                  )}
                </ul>
                <div className='menu-trigger'>
                  <span>Menu</span>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarToggle}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />

      <div className="page-heading header-text">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h3>Booking</h3>
            </div>
          </div>
        </div>
      </div>


      <div className='container-control'>
        <div className='container-booking'>
          <div className='booking'>
            <div className='logo'>
              <img src={Logo} alt="" />
            </div>
            <div className='details'>
              Enter your details
            </div>

            <div className='booking-content'>
              <div className='booking-form'>
                <div className=''></div>
                <form >
                  <label>RoomId
                    <input
                      type="number"
                      name="roomId"  // ตรวจสอบให้ตรงกับชื่อใน handleChange
                      value={room.NumberOfRooms || ""}
                      onChange={handleChange}
                    />
                  </label>
                  <label>CheckIn
                    <input
                      type="date"
                      name="checkIn"
                      value={inputs.checkIn || ""}
                      onChange={handleChange}
                    />
                  </label>
                  <label>CheckOut
                    <input
                      type="date"
                      name="checkOut"
                      value={inputs.checkOut || ""}
                      onChange={handleChange}
                    />
                  </label>
                </form>
              </div>
            </div>
          </div>
        </div>
        {room && (
          <div className='reservation-summary'>
            <h4><strong>Reservation Summary</strong></h4>
            <p>Room Name: <strong>{room.name}</strong></p>
            <p>Price: <strong>THB {room.price}</strong></p>
            <p>Number of Rooms: <strong>{room.NumberOfRooms}</strong></p>
            <p>Area: <strong>{room.area}</strong></p>
            <p><strong>Stay 2 Nights Extra Save 5%</strong></p>
            <button type='submit' className='confirm-booking-btn' onClick={handleSubmit}>Confirm Booking</button>
          </div>
        )}
      </div>

      <footer>
        <div className="container">
          <div className="col-lg-8">
            <p>© 2018 www.baraliresort.com. All rights reserved. </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Booking
