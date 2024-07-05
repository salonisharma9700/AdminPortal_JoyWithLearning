import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VidList = () => {
  const [formDetails, setFormDetails] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editing, setEditing] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/forms');
        const forms = response.data;

        const formDetailsWithFeedback = await Promise.all(
          forms.map(async (form) => {
            try {
              const feedbackResponse = await axios.get(`http://localhost:5000/api/getAdminVidFeedback/${form._id}`);
              return {
                ...form,
                status: feedbackResponse.data.status || 'No status',
                feedback: feedbackResponse.data.feedback || 'No feedback'
              };
            } catch (error) {
              if (error.response && error.response.status === 404) {
                console.error(`Feedback not found for form: ${form._id}`);
                return {
                  ...form,
                  status: 'No status',
                  feedback: 'No feedback'
                };
              } else {
                throw error; // Propagate other errors
              }
            }
          })
        );

        setFormDetails(formDetailsWithFeedback);
      } catch (error) {
        setError(error.toString());
        console.error('Error fetching form details:', error);
      }
    };

    fetchFormDetails();
  }, []);

  const handleStatusChange = (id, value) => {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: value
      }
    }));
  };

  const handleFeedbackChange = (id, value) => {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        feedback: value
      }
    }));
  };

  const handleSave = async (id) => {
    try {
      const updatedDetails = editing[id];
      const response = await axios.patch(`http://localhost:5000/api/updateFeedback/${id}`, updatedDetails);

      if (response.data && response.data.updatedForm) {
        const updatedForm = response.data.updatedForm;
        setFormDetails((prev) =>
          prev.map((form) =>
            form._id === id ? { ...form, ...updatedDetails } : form
          )
        );
        setEditing((prev) => {
          const { [id]: removed, ...rest } = prev;
          return rest;
        });
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      setError(error.toString());
      console.error('Error updating feedback:', error);
    }
  };

  const filteredFormDetails = formDetails.filter((form) =>
    statusFilter === 'all' ? true : form.status === statusFilter
  );

  return (
    <div className="admin-portal">
      <h1>Form Data</h1>
      <div className="mb-3">
        <label htmlFor="statusFilter" className="form-label">Filter by status:</label>
        <select
          id="statusFilter"
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="inprogress">In Progress</option>
          <option value="checked">Checked</option>
          <option value="done">Done</option>
        </select>
      </div>
      {error && <p className="text-danger">Error: {error}</p>}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
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
              <th>Video</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Feedback/Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFormDetails.map((data) => (
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
                  <a href={`http://localhost:5000/${data.videoPath}`} target="_blank" rel="noopener noreferrer">
                    Play Video
                  </a>
                </td>
                <td>{new Date(data.createdAt).toLocaleString()}</td>
                <td>
                  <select
                    value={editing[data._id]?.status || data.status}
                    onChange={(e) => handleStatusChange(data._id, e.target.value)}
                    className="form-select"
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
                    className="form-control"
                    placeholder="Enter feedback/comments"
                  />
                </td>
                <td>
                  <button onClick={() => handleSave(data._id)} className="btn btn-primary">Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VidList;
