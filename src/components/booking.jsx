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
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const location = useLocation();
  const { room } = location.state || {};
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(prevInputs => {
      const updatedInputs = { ...prevInputs, [name]: value };

      // ตรวจสอบวันที่ CheckOut
      if (name === 'checkIn' && updatedInputs.checkOut && value > updatedInputs.checkOut) {
        setInputs(prevInputs => ({ ...prevInputs, checkOut: "" }));
      }

      return updatedInputs;
    });
  };

  function generateRandomBookingNumber(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fixedPrefix = 'BBR';
    let result = fixedPrefix;

    const remainingLength = length - fixedPrefix.length;

    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }

    return result;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("http://localhost:3333/profile", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'ok') {
          setUser(result.user);
          setIsLoaded(true);  // ตั้งค่าให้ข้อมูลโหลดเสร็จแล้ว
        } else if (result.status === 'forbidden') {
          MySwal.fire({
            html: <i>{result.message}</i>,
            icon: 'error'
          }).then(() => {
            navigate('/login');  // กลับไปหน้าล็อกอินถ้า token หมดอายุ
          });
        }
      })
      .catch((error) => console.error(error));
  }, [MySwal, navigate]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  }

  useEffect(() => {
    if (inputs.checkIn && inputs.checkOut && room) {
      const checkInDate = new Date(inputs.checkIn);
      const checkOutDate = new Date(inputs.checkOut);
      const days = Math.max((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24), 0);

      if (days > 0) {
        const price = room.price * days;
        setTotalPrice(price);
        console.log(price)

        if (days >= 2) {
          const price = room.price * days;
          const discountRate = room.type === 'single room' ? 0.05 : room.type === 'double room' ? 0.10 : 0;
          const discounted = price * (1 - discountRate);
          setDiscountedPrice("discounted", discounted);
        } else {
          setDiscountedPrice(null);
        }
      } else {
        setTotalPrice(room.price);
        setDiscountedPrice(null);
      }
    }
  }, [inputs, room]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const bookingNumber = generateRandomBookingNumber(8);

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const token = localStorage.getItem('token');
    myHeaders.append('Authorization', `Bearer ${token}`);


    const raw = JSON.stringify({
      bookingNumber,
      roomId: room.id,
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
            if (result.accessToken) {
              localStorage.setItem('token', result.accessToken);
              navigate('/BookingDetails');
            } else {
              navigate('/BookingDetails');
            }
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
                  <li><Link to="/SearchRoom"><i className="fa fa-calendar"></i><span>Book Now</span></Link></li>
                  {isLoggedIn && user ? (
                    <li>
                      <Avatar
                        src={user?.image ? `data:image/jpeg;base64,${user.image}` : 'default-image-url'}
                        alt={user?.id}
                        onClick={handleSidebarToggle}
                      />
                    </li>
                  ) : (
                    <li>
                      <button onClick={handleSidebarToggle}>
                      </button>
                    </li>
                  )}
                </ul>
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
                <form  >
                  <label>CheckIn
                    <input
                      type="date"
                      name="checkIn"
                      value={inputs.checkIn || ""}
                      onChange={handleChange}
                      min={today}
                    />
                  </label>
                  <label>CheckOut
                    <input
                      type="date"
                      name="checkOut"
                      value={inputs.checkOut || ""}
                      onChange={handleChange}
                      min={inputs.checkIn ? new Date(inputs.checkIn).toISOString().split('T')[0] : today}
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
            <p>Price per Night: <strong>THB {room.price}</strong></p>
            <p>Days: <strong>{Math.max((new Date(inputs.checkOut) - new Date(inputs.checkIn)) / (1000 * 60 * 60 * 24), 1)} days</strong></p>
            <p><strong>Stay 2 Nights Extra Save 5%</strong></p>
            <p><strong>Total Price:</strong> {typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'} THB</p>
            {discountedPrice !== null && (
              <p><strong>Discounted Price:</strong> {typeof discountedPrice === 'number' ? discountedPrice.toFixed(2) : '0.00'} THB</p>
            )}
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