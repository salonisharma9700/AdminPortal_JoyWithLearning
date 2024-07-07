import React, { useEffect, useState } from 'react';
import '../cssfiles/sal.css';

const apiUrl = process.env.REACT_APP_API_URL;

const FormDataList = () => {
    const [formData, setFormData] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [editing, setEditing] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/getFormDataWithFeedback`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log('Fetched data:', data); // Debugging line to verify fetched data
            setFormData(data);
        } catch (error) {
            setError(error.toString());
            console.error('Error fetching form data:', error);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setEditing(prevEditing => ({
            ...prevEditing,
            [id]: { ...prevEditing[id], status: newStatus }
        }));
    };

    const handleFeedbackChange = (id, newFeedback) => {
        setEditing(prevEditing => ({
            ...prevEditing,
            [id]: { ...prevEditing[id], feedback: newFeedback }
        }));
    };

    const handleSave = async (id) => {
        try {
            const { status, feedback } = editing[id];
    
            const response = await fetch(`${apiUrl}/api/adminvidfeedback/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, feedback }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update status and feedback');
            }
    
            const data = await response.json();
            console.log('Server response:', data);
    
            setFormData(prevFormData =>
                prevFormData.map(data => (data._id === id ? { ...data, status, feedback } : data))
            );
    
            setEditing(prevEditing => {
                const newEditing = { ...prevEditing };
                delete newEditing[id];
                return newEditing;
            });
        } catch (error) {
            console.error('Error updating status and feedback:', error);
        }
    };
    
    const filteredData = filter === 'all' ? formData : formData.filter(data => data.status === filter);

    return (
        <div>
            <h1>Form Data</h1>
            <div>
                <label htmlFor="statusFilter">Filter by status: </label>
                <select
                    id="statusFilter"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="inprogress">In Progress</option>
                    <option value="checked">Checked</option>
                    <option value="done">Done</option>
                </select>
            </div>
            {error && <p>Error: {error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Child Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Father's Name</th>
                        <th>Father's Contact</th>
                        <th>Father's Email</th>
                        <th>Mother's Name</th>
                        <th>Mother's Contact</th>
                        <th>Mother's Email</th>
                        <th>Message</th>
                        <th>Video Responses</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Feedback/Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((data) => (
                        <tr key={data._id}>
                            <td>{data.childName}</td>
                            <td>{data.age}</td>
                            <td>{data.gender}</td>
                            <td>{data.fathersName}</td>
                            <td>{data.fathersContact}</td>
                            <td>{data.fathersEmail}</td>
                            <td>{data.mothersName}</td>
                            <td>{data.mothersContact}</td>
                            <td>{data.mothersEmail}</td>
                            <td>{data.message}</td>
                            <td>
                                {data.videoResponses.map((vr, index) => (
                                    <div key={index}>
                                        <strong>videoid:</strong> {vr.videoId}<br />
                                        <strong>response:</strong> {vr.response}
                                    </div>
                                ))}
                            </td>
                            <td>{new Date(data.createdAt).toLocaleString()}</td>
                            <td>
                                <select
                                    value={editing[data._id]?.status || data.status}
                                    onChange={(e) => handleStatusChange(data._id, e.target.value)}
                                >
                                    <option value="inprogress">In Progress</option>
                                    <option value="checked">Checked</option>
                                    <option value="done">Done</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={editing[data._id]?.feedback || data.feedback}
                                    onChange={(e) => handleFeedbackChange(data._id, e.target.value)}
                                    placeholder="Enter feedback/comments"
                                />
                            </td>
                            <td>
                                <button onClick={() => handleSave(data._id)}>Save</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FormDataList;