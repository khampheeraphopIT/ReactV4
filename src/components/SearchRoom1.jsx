import React, { useState } from 'react';
import '../assets/css/fontawesome.css';
import '../assets/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'swiper/swiper-bundle.css';
import properties_01 from '../assets/images/property-01.jpg'
import properties_02 from '../assets/images/property-02.jpg'
import properties_03 from '../assets/images/property-03.jpg'
import properties_04 from '../assets/images/property-04.jpg'
import properties_05 from '../assets/images/property-05.jpg'
import properties_06 from '../assets/images/property-06.jpg'
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.jpg'
import { Avatar } from '@mui/material';
import '../assets/css/Sidebar.css'
import Sidebar from '../components/sidebar'


const SearchRoom = () => {
  const [filter, setFilter] = useState('*');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleRoomDetails = (roomId) => {
    navigate(`/RoomDetails/${roomId}`);
  };

  const rooms = [
    { id: 1, type: 'single room', image: properties_01, name: 'DELUXE VILLA', price: 3500, NumberOfRooms: 1, area: '15x15' },
    { id: 2, type: 'single room', image: properties_02, name: 'PREMIER DULUXE VILLA', price: 4000, NumberOfRooms: 2, area: '15x17' },
    { id: 3, type: 'single room', image: properties_03, name: 'POOL VILLA', price: 5000, NumberOfRooms: 3, area: '15x20' },
    { id: 4, type: 'double room', image: properties_04, name: 'DELUXE VILLA', price: 6000, NumberOfRooms: 4, area: '20x20' },
    { id: 5, type: 'double room', image: properties_05, name: 'PREMIER DELUXE VILLA', price: 6500, NumberOfRooms: 5, area: '25x25' },
    { id: 6, type: 'double room', image: properties_06, name: 'POOL VILLA', price: 7500, NumberOfRooms: 6, area: '30x30' }
  ];

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <Link to="/" className="logo">
                  <img src={Logo} alt="" />
                </Link>

                <ul className="nav">
                  <li><Link to="/" className="active">Home</Link></li>
                  <li><Link to="/SearchRoom1">Search Room</Link></li>
                  <li><Link to="/Contact">Contact Us</Link></li>
                  <li><Link to="/SearchRoom"><i className="fa fa-calendar"></i><span>Book Now</span></Link></li>
                  {isLoggedIn ? (
                    <li><Avatar alt="Profile" onClick={handleSidebarToggle} /></li>
                  ) : (
                    <li><Avatar alt='Profile' onClick={handleSidebarToggle}></Avatar></li>
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
              <h3>Search Room</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="section properties">
        <div className="container">
          {/* Input ค้นหา */}
          <input
            type="text"
            placeholder="Search by room type..."
            onChange={handleSearch}
            className="Search"
          />

          <ul className="properties-filter">
            <li><a className={filter === '*' ? 'is_active' : ''} href="#!" onClick={() => handleFilterChange('*')}>Show All</a></li>
            <li><a className={filter === 'single room' ? 'is_active' : ''} href="#!" onClick={() => handleFilterChange('single room')}>Single Room</a></li>
            <li><a className={filter === 'double room' ? 'is_active' : ''} href="#!" onClick={() => handleFilterChange('double room')}>Double Room</a></li>
          </ul>

          <div className="row properties-box">
            {rooms
              .filter(room =>
                (filter === '*' || room.type === filter) &&
                (room.name.toLowerCase().includes(searchTerm) || room.type.toLowerCase().includes(searchTerm))
              )
              .map(room => (
                <div key={room.id} className={`col-lg-4 col-md-6 align-self-center mb-30 properties-items ${room.type}`}>
                  <div className="item">
                    <Link to={`/RoomDetails1/${room.id}`} onClick={() => handleRoomDetails(room.id)}>
                      <img src={room.image} alt={room.name} />
                    </Link>
                    <span className="category">{room.type === 'single room' ? 'Single Room' : 'Double Room'}</span>
                    <h6>THB {room.price}</h6>
                    <h4><Link to={`/RoomDetails1/${room.id}`} onClick={() => handleRoomDetails(room.id)}>
                      {room.name}
                    </Link></h4>
                    <ul>
                      <li>Number of rooms: <span>{room.NumberOfRooms}</span></li>
                      <li>Area: <span>{room.area}</span></li>
                      <li>Stay 2 Nights Extra Save 5%</li>
                    </ul>
                    <div className="main-button">
                      <Link to={`/RoomDetails1/${room.id}`} onClick={() => handleRoomDetails(room.id)}>Room Details</Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>

        </div>
      </div>

      <footer>
        <div className="container">
          <div className="col-lg-12">
            <p>© 2018 www.baraliresort.com. All rights reserved. </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchRoom;
