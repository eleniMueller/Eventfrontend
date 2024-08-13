import React, {useState} from 'react';
import {Button} from 'antd';
import {ArrowRightOutlined, UserOutlined} from '@ant-design/icons';
import EventDetailModal from './EventDetailModal';
import ParticipantDetailModal from './ParticipantDetailModal';
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
    const [isEventModalVisible, setIsEventModalVisible] = useState(false);
    const [isParticipantModalVisible, setIsParticipantModalVisible] = useState(false);

    const showEventModal = () => {
        setIsEventModalVisible(true);
    };

    const handleEventModalClose = () => {
        setIsEventModalVisible(false);
    };

    const showParticipantModal = () => {
        setIsParticipantModalVisible(true);
    };

    const handleParticipantModalClose = () => {
        setIsParticipantModalVisible(false);
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
            <Button icon={<ArrowRightOutlined/>} onClick={showEventModal}/>
            <Button icon={<UserOutlined/>} onClick={showParticipantModal}/>
            <EventDetailModal visible={isEventModalVisible} onClose={handleEventModalClose} event={event}/>
            <ParticipantDetailModal visible={isParticipantModalVisible} onClose={handleParticipantModalClose}
                                    eventId={event.event_id}/>
        </div>
    );
};

export default Eventlist;