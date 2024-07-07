// // VidList.js (or any appropriate component name)

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const VidList = () => {
//   const [formDetails, setFormDetails] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true); // Loading indicator state

//   useEffect(() => {
//     const fetchFormDetails = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/adminmedia');
//         setFormDetails(response.data);
//         setIsLoading(false); // Data fetching complete
//       } catch (error) {
//         // setError(error.toString());  
//         console.error('Error fetching form details:', error);
//       }
//     };

//     fetchFormDetails();
//   }, []);

//   return (
//     <div className="admin-portal">
//       <h1>Form Data</h1>
//       {isLoading && <p>Loading...</p>} {/* Loading indicator */}
//       {error && <p className="text-danger">Error: {error}</p>}
//       <div className="table-responsive">
//         <table className="table table-bordered table-striped">
//           <thead>
//             <tr>
//               <th>Child Name</th>
//               <th>Age</th>
//               <th>Gender</th>
//               <th>Father's Name</th>
//               <th>Father's Contact</th>
//               <th>Father's Email</th>
//               <th>Mother's Name</th>
//               <th>Mother's Contact</th>
//               <th>Mother's Email</th>
//               <th>Message</th>
//               <th>Video</th>
//               <th>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formDetails.map((data) => (
//               <tr key={data._id}>
//                 <td>{data.childName}</td>
//                 <td>{data.age}</td>
//                 <td>{data.gender}</td>
//                 <td>{data.fathersName}</td>
//                 <td>{data.fathersContact}</td>
//                 <td>{data.fathersEmail}</td>
//                 <td>{data.mothersName}</td>
//                 <td>{data.mothersContact}</td>
//                 <td>{data.mothersEmail}</td>
//                 <td>{data.message}</td>
//                 <td>
//                   <a href={`http://localhost:5000/${data.videoPath}`} target="_blank" rel="noopener noreferrer">
//                     Play Video
//                   </a>
//                 </td>
//                 <td>{new Date(data.createdAt).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default VidList;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const VidList = () => {
  const [formDetails, setFormDetails] = useState([]);
  const [filteredFormDetails, setFilteredFormDetails] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading indicator state
  const [statusFilter, setStatusFilter] = useState('all'); // Status filter state

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/adminmedia`);
        setFormDetails(response.data);
        setIsLoading(false); // Data fetching complete
      } catch (error) {
        setError('Error fetching form details');  
        console.error('Error fetching form details:', error);
      }
    };

    fetchFormDetails();
  }, []);

  // Update filteredFormDetails when formDetails or statusFilter changes
  useEffect(() => {
    filterFormDetails();
  }, [formDetails, statusFilter]);

  const filterFormDetails = () => {
    if (statusFilter === 'all') {
      setFilteredFormDetails(formDetails);
    } else {
      const filtered = formDetails.filter((form) => form.status === statusFilter);
      setFilteredFormDetails(filtered);
    }
  };
  const handleStatusChange = async (id, status) => {
    try {
      // Send a POST request to the backend API to save or update status
      await axios.post(`${apiUrl}/api/saveAdminVidFeedback`, { formId: id, status });
  
      // Update the frontend state (formDetails) with the updated status
      const updatedForms = formDetails.map((form) =>
        form._id === id ? { ...form, status } : form
      );
      setFormDetails(updatedForms);
  
      // Update the filtered form details if necessary
      filterFormDetails();
    } catch (error) {
      setError('Error updating status');
      console.error('Error updating status:', error);
    }
  };
  
  
  const handleFeedbackChange = async (id, feedback) => {
    try {
      await axios.post(`${apiUrl}/api/saveAdminVidFeedback`, { formId: id, feedback });
      const updatedForms = formDetails.map((form) =>
        form._id === id ? { ...form, feedback } : form
      );
      setFormDetails(updatedForms);
      filterFormDetails(); // Update filtered list if necessary
    } catch (error) {
      setError('Error updating feedback');
      console.error('Error updating feedback:', error);
    }
  };
  
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
      {isLoading && <p>Loading...</p>} {/* Loading indicator */}
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
              <th>Feedback</th>
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
                  <a href={`${apiUrl}/${data.videoPath}`} target="_blank" rel="noopener noreferrer">
                    Play Video
                  </a>
                </td>
                <td>{new Date(data.createdAt).toLocaleString()}</td>
                <td>
                  <select
                    value={data.status}
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
                    value={data.feedback || ''}
                    onChange={(e) => handleFeedbackChange(data._id, e.target.value)}
                    className="form-control"
                    placeholder="Enter feedback/comments"
                  />
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
