// src/components/Eventlist.jsx
import React, {useState} from 'react';
import {Button} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';
import EventDetailModal from './EventDetailModal';
import './styling/Eventlist.css';

const categoryMap = {
    1: "Feier / Apéro",
    2: "Externer Anlass",
    3: "Schulung",
    4: "Sport",
    5: "Interner Anlass",
    6: "Unterhaltung",
    7: "Öffentliche Veranstaltung"
};

const Eventlist = ({event}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="event-card">
            <div className="event-image">
                <img src={event.image} alt="Event"/>
            </div>
            <div className="event-details">
                <h4>{event.title}</h4>
                <p className={"categorytext"}>{categoryMap[event.category_id]}</p>
                <p>Datum: {event.date}</p>
                <p>Dauer: {event.duration} Minuten</p>
                <p>Location: {event.location}</p>
            </div>
            <Button icon={<ArrowRightOutlined/>} onClick={showModal}/>
            <EventDetailModal visible={isModalVisible} onClose={handleClose} event={event}/>
        </div>
    );
};

export default Eventlist;