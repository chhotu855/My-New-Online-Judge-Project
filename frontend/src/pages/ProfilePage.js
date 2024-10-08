// ProfilePage.js

import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';
import { UserContext } from './UserContext';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profileInfo, setProfileInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ fullName: '', email: '', newPassword: '', oldPassword: '' });
  const [solvedProblems, setSolvedProblems] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${userId}`);
        setProfileInfo(response.data.user); // Adjust according to your response structure
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Error fetching user profile');
      }
    };
    fetchUser();

    const fetchSolvedProblems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}/solved-problems`);
        setSolvedProblems(response.data.solvedProblems);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };
    fetchSolvedProblems();
  }, [userId]);

  if (!profileInfo) {
    return <p>Loading profile...</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put('http://localhost:5000/update', editData, { withCredentials: true });
      setProfileInfo(response.data.user);
      setIsEditing(false);
      toast.success('User data updated successfully!', {
        position: "top-center",
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error("Wrong Password !", {
        position: "top-center",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure to want to delete your account? This action cannot be undo.');
      if (confirmDelete) {
        const password = prompt('Please enter your password to confirm deletion:');
        if (password) {
          const response = await axios.delete('http://localhost:5000/delete', { withCredentials: true, data: { password } });
          toast.success('Account deleted successfully', {
            position: "top-center",
          });
          navigate('/'); // Redirect to home page after deletion
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Wrong Password !", {
        position: "top-center",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      toast.success('Logged out successfully', {
        position: "top-center",
        autoClose: 5000
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out: ' + (error.response?.data?.message || error.message), {
        position: "top-center",
      });
    }
  };

  const onClickProfileBtn = () => {
    console.log("Profile Clicked!!");
    console.log(user);
    if (user && user._id) {
      navigate(`/profile/${user._id}`);
    } else {
      console.error('User ID not found Comp');
      toast.error("User ID not found!", { position: "top-center" });
    }
  };

  return (
    <div>
      <ToastContainer />
      {/* HEADER */}
      <div className="headerProfile">
        <div className="left">
          <img src="/Assets/logo.png" alt="Logo" />
        </div>
        <div className="right">
          <Link to="/problemslist">Problems</Link>
          <button className="cmpBtn" onClick={onClickProfileBtn}>
              <img src="/Assets/ProfileLogo.png" className="profileLogo" alt="Logo" />
          </button>
        </div>
      </div>

      <div className="details">
        <div className="leftSideDetails">
          {/* PROFILE DETAILS */}
          <div className="profileInfo">
            <h2>User Details</h2>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={editData.fullName}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editData.email}
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={editData.newPassword}
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password (for verification)"
                  value={editData.oldPassword}
                  onChange={handleInputChange}
                />
                <div className="operationBtn">
                  <button className="green" onClick={handleUpdate}>Save</button>
                  <button className="green" onClick={() => {
                    setIsEditing(false);
                    setEditData({ fullName: '', email: '', newPassword: '', oldPassword: '' });
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <p><strong>Name:</strong> {profileInfo.fullName}</p>
                <p><strong>Email:</strong> {profileInfo.email}</p>
                <p><strong>Role:</strong> {profileInfo.Admin ? 'admin' : 'user'}</p>
                {/* ACCOUNT ACTIONS */}
                <div className="accountActions">
                  <button className="green" onClick={() => setIsEditing(true)}>Edit Profile</button>
                  <button className="red" onClick={handleLogout}>Logout</button>
                  <button className="red" onClick={handleDelete}>Delete Account</button>
                </div>
              </div>
            )}
          </div>
          <div className="profilePicture">
            <img src="/Assets/profile-user.png" alt="Profile" />
          </div>
        </div>

        <div className="rightSideDetails">
          {/* SOLVED PROBLEMS */}
          <div className="solvedProblems">
            <h2>Solved Problems:</h2>
            {solvedProblems && solvedProblems.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {solvedProblems.map((problem) => (
                    <tr key={problem._id}>
                      <td>
                        <Link to={`/problems/${problem._id}`}>{problem.title}</Link>
                      </td>
                      <td>{problem.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No problems solved yet.</p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ProfilePage;
