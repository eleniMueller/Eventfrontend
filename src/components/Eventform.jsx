import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styling/Eventform.css';

const categoryMap = {
    1: "Feier / Apéro",
    2: "Externer Anlass",
    3: "Schulung",
    4: "Sport",
    5: "Interner Anlass",
    6: "Unterhaltung",
    7: "Öffentliche Veranstaltung"
};

const Eventform = () => {
    const location = useLocation();
    const initialValues = location.state?.initialValues || {};
    const [formData, setFormData] = useState({
        title: initialValues.title || '',
        description: initialValues.description || '',
        date: initialValues.date || '',
        duration: initialValues.duration || '',
        location: initialValues.location || '',
        owner_email: initialValues.owner_email || '',
        participant_limit: initialValues.participant_limit || '',
        category_id: initialValues.category_id || null,
        image: initialValues.image || '',
        keywords: Array.isArray(initialValues.keywords) ? initialValues.keywords : (initialValues.keywords ? initialValues.keywords.split(', ') : [])
    });
    const [keywordInput, setKeywordInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleKeywordChange = (e) => setKeywordInput(e.target.value);

    const handleKeywordKeyDown = (e) => {
        if (e.key === 'Enter' && keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
            e.preventDefault();
            setFormData({ ...formData, keywords: [...formData.keywords, keywordInput.trim()] });
            setKeywordInput('');
        }
    };

    const removeKeyword = (keywordToRemove) => {
        setFormData({
            ...formData,
            keywords: formData.keywords.filter(keyword => keyword !== keywordToRemove)
        });
    };

    const isDateInPast = (date) => new Date(date) < new Date();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDateInPast(formData.date)) {
            setError('Das Datum darf nicht in der Vergangenheit liegen.');
            return;
        }

        const requiredFields = ['title', 'description', 'date', 'duration', 'location', 'owner_email', 'participant_limit', 'category_id'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setError('Bitte füllen Sie alle erforderlichen Felder aus.');
                return;
            }
        }

        setError('');
        const eventData = {
            ...formData,
            category_id: formData.category_id || null,
            keywords: formData.keywords.join(', ')
        };
        try {
            const method = initialValues.event_id ? 'PATCH' : 'POST';
            const url = initialValues.event_id
                ? `http://localhost:8080/events/${initialValues.event_id}`
                : 'http://localhost:8080/events';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            await response.json();
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>{initialValues.title ? 'Event bearbeiten' : 'Neues Event erfassen'}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Titel*</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} />
                <br />
                <label htmlFor="description">Description*</label>
                <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} />
                <br />
                <label htmlFor="date">Datum*</label>
                <input type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} />
                <br />
                <label htmlFor="duration">Dauer (in Minuten)*</label>
                <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} />
                <br />
                <label htmlFor="location">Location*</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
                <br />
                <label htmlFor="owner_email">Wie Lautet deine Email?*</label>
                <input type="email" id="owner_email" name="owner_email" value={formData.owner_email} onChange={handleChange} />
                <br />
                <label htmlFor="participant_limit">Maximale Anzahl Teilnehmer*</label>
                <input type="number" id="participant_limit" name="participant_limit" value={formData.participant_limit} onChange={handleChange} />
                <br />
                <label htmlFor="category_id">Kategorie*</label>
                <select id="category_id" name="category_id" value={formData.category_id || ''} onChange={handleChange}>
                    <option value="">Keine Kategorie</option>
                    {Object.entries(categoryMap).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
                <br />
                <label htmlFor="image">Bild</label>
                <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
                <br />
                <label htmlFor="keywords">Keywords</label>
                <input type="text" id="keywords" value={keywordInput} onChange={handleKeywordChange} onKeyDown={handleKeywordKeyDown} />
                <ul>
                    {formData.keywords.map((keyword, index) => (
                        <li key={index}>
                            {keyword} <button type="button" onClick={() => removeKeyword(keyword)}>X</button>
                        </li>
                    ))}
                </ul>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">{initialValues.title ? 'Event aktualisieren' : 'Event erfassen'}</button>
            </form>
        </div>
    );
};

export default Eventform;