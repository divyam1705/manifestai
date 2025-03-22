import React, { useState } from 'react';
import { insertEvent, EventType } from '../actions/google-calendar'; // Adjust the import path as necessary
import { Input } from './ui/input';
import { Button } from './ui/button';

const AddEvent: React.FC = () => {
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState<Date | null>(null);
    const [endDateTime, setEndDateTime] = useState<Date | null>(null);
    const [error, setError] = useState('');

    const handleAddEvent = async () => {
        const event: EventType = {
            summary,
            description,
            start: {
                dateTime: startDateTime?.toISOString() || "",
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Adjust the time zone as necessary
            },
            end: {
                dateTime: endDateTime?.toISOString() || "",
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Adjust the time zone as necessary
            },
        };

        try {
            await insertEvent(event);
            // Clear inputs after successful insertion
            setSummary('');
            setDescription('');
            const now = new Date();
            setStartDateTime(now);
            setEndDateTime(now);
            setError('');
        } catch (err) {
            setError('Failed to add event. Please try again.');
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Add Event to Calendar</h2>
            {error && <p className="text-red-500">{error}</p>}
            <Input
                placeholder="Event Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />
            <Input
                placeholder="Event Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Input
                type="datetime-local"
                value={startDateTime ? startDateTime.toISOString().slice(0, 16) : ''}
                onChange={(e) => setStartDateTime(e.target.value ? new Date(e.target.value) : null)}
            />
            <Input
                type="datetime-local"
                value={endDateTime ? endDateTime.toISOString().slice(0, 16) : ''}
                onChange={(e) => setEndDateTime(e.target.value ? new Date(e.target.value) : null)}
            />
            <Button onClick={handleAddEvent}>Add to Calendar</Button>
        </div>
    );
};

export default AddEvent;
