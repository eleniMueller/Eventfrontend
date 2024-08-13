import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Modal} from 'antd';
import {useNavigate} from 'react-router-dom';
import './styling/Eventdetail.css';

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
    const [errorMessage, setErrorMessage] = useState('');
    const [remainingSpots, setRemainingSpots] = useState(event.participant_limit);
    const [isFull, setIsFull] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (visible) {
            fetch(`http://localhost:8080/participants/event/${event.event_id}`)
                .then(response => response.json())
                .then(data => {
                    const participantCount = data.length;
                    const spotsLeft = event.participant_limit - participantCount;
                    setRemainingSpots(spotsLeft);
                    setIsFull(spotsLeft <= 0);
                })
                .catch(error => console.error('Error fetching participants:', error));
        }
    }, [visible, event]);
    const handleFormSubmit = (values) => {
        const fullName = `${values.firstName} ${values.lastName}`;
        const currentTimestamp = new Date().toISOString();
        const data = {
            eventId: event.event_id,
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
                form.resetFields();
                alert('Sie haben sich erfolgreich angemeldet!');

            })
            .catch(error => {
                console.error('Error registering:', error);
                setErrorMessage('Bei der Anmeldung ist etwas fehlgeschlagen.');
            });
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
            title: 'Sind Sie sicher, dass Sie diesen Event löschen möchten? Es werden auch alle Teilnehmer gelöscht.',
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
                        <p>Noch freie Plätze: {remainingSpots}</p>
                    </div>
                    <div className="modal-form">
                        {isFull ? (
                            <p style={{color: 'red'}}>Keine Plätze mehr frei</p>
                        ) : (
                            <>
                                <h3>Melde dich jetzt noch an!</h3>
                                <Form form={form} onFinish={handleFormSubmit}>
                                    <Form.Item
                                        required={true}
                                        name="firstName"
                                        rules={[{required: true, message: 'Bitte geben Sie Ihren Vornamen ein'}]}
                                    >
                                        <Input placeholder="Vorname"/>
                                    </Form.Item>
                                    <Form.Item
                                        required={true}
                                        name="lastName"
                                        rules={[{required: true, message: 'Bitte geben Sie Ihren Nachnamen ein'}]}
                                    >
                                        <Input placeholder="Nachname"/>
                                    </Form.Item>
                                    <Form.Item
                                        required={true}
                                        name="email"
                                        rules={[{required: true, message: 'Bitte geben Sie Ihre Email ein'}]}
                                    >
                                        <Input placeholder="E-Mail"/>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Anmelden!</Button>
                                    </Form.Item>
                                </Form>
                            </>
                        )}
                        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
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