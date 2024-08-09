import React, { useState, useEffect } from 'react';
import { Modal, List, Button, Input } from 'antd';
import './styling/ParticipantDetail.css';

const ParticipantDetailModal = ({ visible, onClose, eventId }) => {
    const [participants, setParticipants] = useState([]);
    const [editingParticipantId, setEditingParticipantId] = useState(null);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        if (visible) {
            fetch(`http://localhost:8080/participants/event/${eventId}`)
                .then(response => response.json())
                .then(data => setParticipants(data))
                .catch(error => console.error('Error fetching participants:', error));
        }
    }, [visible, eventId]);

    const deleteParticipant = (participant) => () => {
        fetch(`http://localhost:8080/participants/delete/${participant.participant_id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setParticipants(participants.filter(p => p.participant_id !== participant.participant_id));
                } else {
                    console.error('Failed to delete participant');
                }
            })
            .catch(error => console.error('Error deleting participant:', error));
    };

    const editParticipant = (participant) => () => {
        setEditingParticipantId(participant.participant_id);
        setNewName(participant.name);
    };

    const saveParticipant = (participant) => () => {
        const updatedParticipant = { ...participant, name: newName };
        fetch(`http://localhost:8080/participants/update/${participant.participant_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedParticipant),
        })
            .then(response => {
                if (response.ok) {
                    setParticipants(participants.map(p =>
                        p.participant_id === participant.participant_id ? updatedParticipant : p
                    ));
                    setEditingParticipantId(null);
                } else {
                    console.error('Failed to update participant');
                }
            })
            .catch(error => console.error('Error updating participant:', error));
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
                                    <Button type="link" className="participant-edit-button" onClick={editParticipant(participant)}>Edit</Button>,
                                    <Button type="link" className="participant-delete-button" onClick={deleteParticipant(participant)}>Delete</Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        editingParticipantId === participant.participant_id ? (
                                            <div>
                                                <Input
                                                    value={newName}
                                                    onChange={e => setNewName(e.target.value)}
                                                    placeholder="Enter new name"
                                                />
                                                <Button type="primary" onClick={saveParticipant(participant)}>Save</Button>
                                            </div>
                                        ) : (
                                            participant.name
                                        )
                                    }
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