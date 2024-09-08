// UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the UserContext
//const UserContext = createContext();
const UserContext = createContext({ user: null, setUser: () => {} });

// UserProvider component that will wrap around parts of your app that need access to the user data
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Making a GET request to fetch the authenticated user
        const response = await axios.get('http://localhost:5000/auth/me', {
          withCredentials: true, // Ensure credentials (cookies) are included
        });
        console.log('User data fetched:', response.data); // Log the response data for debugging
        if (response.data.user) {
          setUser(response.data.user ); // Update the user state with fetched user data
        } else {
          setUser(null); // Handle case where user data is not present
        }  
      } catch (error) {
         console.error('Error fetching user:', error.response ? error.response.data : error.message);
         setUser(null); // Set user to null if there’s an error
      } finally {
        setLoading(false); // End loading state
      }
    };

    // Fetch the user data when the component mounts
    fetchUser();
  }, []);  // Empty dependency array means this effect runs once on mount

  // Provide the user data and a way to update it (setUser) to any components that need it
  // return (
  //   <UserContext.Provider value={{ user, setUser }}>
  //     {children}
  //   </UserContext.Provider>
  // );

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  ); 
};

export { UserContext, UserProvider };
