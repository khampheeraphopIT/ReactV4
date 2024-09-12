import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import properties_01 from '../assets/images/property-01.jpg'
import properties_02 from '../assets/images/property-02.jpg'
import properties_03 from '../assets/images/property-03.jpg'
import properties_04 from '../assets/images/property-04.jpg'
import properties_05 from '../assets/images/property-05.jpg'
import properties_06 from '../assets/images/property-06.jpg'
import Logo from '../assets/images/logo.jpg'
import { Avatar } from '@mui/material';
import '../assets/css/Sidebar.css'
import Sidebar from '../components/sidebar'
import HotelIcon from '@mui/icons-material/Hotel'
import BedIcon from '@mui/icons-material/Bed'

const images = {
    'property-01.jpg': properties_01,
    'property-02.jpg': properties_02,
    'property-03.jpg': properties_03,
    'property-04.jpg': properties_04,
    'property-05.jpg': properties_05,
    'property-06.jpg': properties_06
};

const RoomDetails1 = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);

    const navigate = useNavigate();

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    }

    useEffect(() => {
        // Replace this with your actual data fetching logic
        const fetchRoomDetails = async () => {
            // Dummy data, replace with actual fetch
            const rooms = [
                { id: 1, type: <HotelIcon style={{ fontSize: 30 }}></HotelIcon>, image: 'property-01.jpg', name: 'DELUXE VILLA', price: '3,500', area: '15x15' },
                { id: 2, type: <HotelIcon style={{ fontSize: 30 }}></HotelIcon>, image: 'property-02.jpg', name: 'PREMIER DULUXE VILLA', price: '4,000', area: '15x17' },
                { id: 3, type: <HotelIcon style={{ fontSize: 30 }}></HotelIcon>, image: 'property-03.jpg', name: 'POOL VILLA', price: '5,000', area: '15x20' },
                { id: 4, type: <BedIcon style={{ fontSize: 30 }}></BedIcon>, image: 'property-04.jpg', name: 'DELUXE VILLA', price: '6,000', area: '20x20' },
                { id: 5, type: <BedIcon style={{ fontSize: 30 }}></BedIcon>, image: 'property-05.jpg', name: 'PREMIER DELUXE VILLA', price: '6,500', area: '25x25' },
                { id: 6, type: <BedIcon style={{ fontSize: 30 }}></BedIcon>, image: 'property-06.jpg', name: 'POOL VILLA', price: '7,500', area: '30x30' }
            ];
            const roomDetails = rooms.find(room => room.id === parseInt(roomId));
            setRoom(roomDetails);
        };

        fetchRoomDetails();
    }, [roomId]);

    const handleBookNow = () => {
        // Remove the React Element (type) from the room object before navigating
        const { type, ...roomWithoutIcons } = room;
    
        navigate('/booking', { state: { room: roomWithoutIcons } });
    }

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <div>

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
                                    <li><Link to="/" className="active">Home</Link></li>
                                    <li><Link to="/SearchRoom">Search Room</Link></li>
                                    <li><Link to="/Contact1">Contact Us</Link></li>
                                    <li><Link to="/SearchRoom"><i className="fa fa-calendar"></i><span>Book Now</span></Link></li>
                                    <li><Link to='/login'><Avatar alt="Profile" /></Link></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            <div className="page-heading header-text">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>Room Details</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section best-deals">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-heading">
                                <h6>| ROOM</h6>
                                <h2>{room.name}</h2>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="tabs-content">
                                <div className="row">
                                    <div className="nav-wrapper">
                                    </div>
                                    <div className="tab-content" id="myTabContent">
                                        <div className="tab-pane fade show active" role="tabpanel">
                                            <div className="row">
                                                <div className="col-lg-3">
                                                    <div className="info-table">
                                                        <ul>
                                                            <h3><i class="fa-solid fa-money-check-dollar"></i>Price: THB {room.price}</h3> <hr />
                                                            <h3><i class="fa-solid fa-bed"></i>Number of rooms: {room.NumberOfRooms}</h3> <hr />
                                                            <h3><i class="fa-solid fa-hotel"></i>Area: {room.area}</h3> <hr />
                                                            <h3><i class="fa-solid fa-award"></i>Stay 2 Nights Extra Save 5%</h3> <hr />
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <img src={images[room.image]} alt="Deal01" />
                                                </div>
                                                <div className="col-lg-3">
                                                    <p>Perfect for solo travelers, our Single Room offers a cozy space with one bed, ideal for rest and relaxation.
                                                        <br /><br />The room is equipped with essential amenities such as a work desk, flat-screen TV, and complimentary Wi-Fi, ensuring a smooth and comfortable stay.</p>
                                                    <div className="main-button">
                                                        <button className='btn' onClick={handleBookNow}><i className="fa fa-calendar"></i> Room Details</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default RoomDetails1;
