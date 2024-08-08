import React, {useEffect, useState} from 'react';
import {Link, Route, Routes, useLocation} from 'react-router-dom';
import axios from 'axios';
import Eventlist from './components/Eventlist';
import Eventform from './components/Eventform';
import './App.css';

function App() {
    const [events, setEvents] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const {data: eventsData} = await axios.get('http://localhost:8080/events');
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <nav>
                    {(location.pathname.startsWith('/event/detail/') || location.pathname === '/new-event') && (
                        <Link to="/">
                            <button className="back-button">zurück</button>
                        </Link>
                    )}
                    <h2>Events</h2>
                    {location.pathname === '/' && (
                        <Link to="/new-event">
                            <button className="add-event-button">Neues Event erfassen</button>
                        </Link>
                    )}
                </nav>
            </header>
            <main>
                <Routes>
                    <Route path="/new-event" element={<Eventform/>}/>
                    <Route path="/" element={
                        events.length === 0 ? (
                            <p>Noch keine Events vorhanden</p>
                        ) : (
                            events.map((event, index) => (
                                <div key={index} className="event-row">
                                    <Eventlist event={event}/>
                                </div>
                            ))
                        )
                    }/>
                </Routes>
            </main>
        </div>
    );
}

export default App;