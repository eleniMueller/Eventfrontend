import React, { useState, useEffect } from 'react';
import { Modal, List, Button } from 'antd';
import './styling/ParticipantDetail.css';

const ParticipantDetailModal = ({ visible, onClose, eventId }) => {
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        if (visible) {
            fetch(`http://localhost:8080/participants/event/${eventId}`)
                .then(response => response.json())
                .then(data => setParticipants(data))
                .catch(error => console.error('Error fetching participants:', error));
        }
    }, [visible, eventId]);

    const deleteParticipant = (participant) => () => {
        console.log('Deleting participant:', participant);
        fetch(`http://localhost:8080/participants/delete/${participant.participant_id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    console.log('Participant deleted');
                    setParticipants(participants.filter(p => p.participant_id !== participant.participant_id));
                } else {
                    console.error('Failed to delete participant');
                }
            })
            .catch(error => console.error('Error deleting participant:', error));
    };

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width="100%"
            bodyStyle={{ padding: 0 }}
            className="participant-modal"
        >
            <div className="participant-detail-modal">
                <h2>Teilnehmerliste</h2>
                {participants.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={participants}
                        renderItem={participant => (
                            <List.Item
                                actions={[
                                    <Button type="link" className="participant-edit-button">Edit</Button>,
                                    <Button type="link" className="participant-delete-button" onClick={deleteParticipant(participant)}>Delete</Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={participant.name}
                                    description={`Email: ${participant.email}`}
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <p>No participants yet</p>
                )}
            </div>
        </Modal>
    );
};

export default ParticipantDetailModal;