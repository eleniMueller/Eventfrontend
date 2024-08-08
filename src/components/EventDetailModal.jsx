// src/components/EventDetailModal.jsx
import React from 'react';
import {Button, Form, Input, Modal} from 'antd';
import {useNavigate} from 'react-router-dom';
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

const EventDetailModal = ({visible, onClose, event}) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleFormSubmit = (values) => {
        const fullName = `${values.firstName} ${values.lastName}`;
        const currentTimestamp = new Date().toISOString();
        const data = {
            event_id: event.event_id,
            name: fullName,
            email: values.email,
            rating: 0,
            registration_time: currentTimestamp,
            attendance_status: true
        };

        console.log('Registering participant:', data);
        fetch('http://localhost:8080/participants/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to register');
                console.log('Registration successful');
            })
            .catch(error => console.error('Error registering:', error));
    };

    const deleteEvent = (event) => {
        fetch(`http://localhost:8080/events/${event.event_id}`, {method: 'DELETE'})
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete event');
                onClose();
                navigate('/');
                window.location.reload();
            })
            .catch(error => console.error('Error deleting event:', error));
    };

    const confirmDelete = (event) => {
        Modal.confirm({
            title: 'Sind Sie sicher, dass Sie diesen Event löschen möchten?',
            content: 'Diese Aktion kann nicht rückgängig gemacht werden.',
            okText: 'Ja',
            cancelText: 'Nein',
            onOk: () => deleteEvent(event),
        });
    };

    const editEvent = (event) => {
        navigate('/new-event', {state: {initialValues: event}});
    };

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width="100%"
            bodyStyle={{padding: 0}}
            className="event-modal"
        >
            <div className="event-detail-modal">
                <div className="modal-header">
                    <h2>{event.title}</h2>
                    <p className="categorytext">{categoryMap[event.category_id]}</p>
                </div>
                <div className="modal-image">
                    <img src={event.image} alt="Event"/>
                </div>
                <div className="modal-content">
                    <div className="modal-description">
                        <p>{event.description}</p>
                        <p>Datum: {event.date}</p>
                        <p>Dauer: {event.duration} Minuten</p>
                        <p>Location: {event.location}</p>
                        <p>Maximale Teilnehmer: {event.participant_limit}</p>
                        <p>Kontakt: {event.owner_email}</p>
                        <p>Schlagwörter: {event.keywords}</p>
                    </div>
                    <div className="modal-form">
                        <h3>Melde dich jetzt noch an!</h3>
                        <Form form={form} onFinish={handleFormSubmit}>
                            <Form.Item
                                name="firstName"
                                rules={[{required: true, message: 'Bitte geben Sie Ihren Vornamen ein'}]}
                            >
                                <Input placeholder="Vorname"/>
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                rules={[{required: true, message: 'Bitte geben Sie Ihren Nachnamen ein'}]}
                            >
                                <Input placeholder="Nachname"/>
                            </Form.Item>
                            <Form.Item
                                name="email"
                                rules={[{required: true, message: 'Bitte geben Sie Ihre Email ein'}]}
                            >
                                <Input placeholder="E-Mail"/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Anmelden!</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className="modal-actions">
                    <Button type="default" onClick={() => confirmDelete(event)}>Diesen Event Löschen</Button>
                    <Button type="default" onClick={() => editEvent(event)}>Diesen Event bearbeiten</Button>
                </div>
            </div>
        </Modal>
    );
};

export default EventDetailModal;