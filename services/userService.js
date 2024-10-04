// services/userService.js

// Base URL of the API
const API_BASE_URL = "https://172.25.18.106:3000/api";

// Fetch user details by ID
export const fetchUserDetails = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

// Example function to sign in a user
export const signInUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to sign in");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during sign in:", error);
    return null;
  }
};

// Example function to sign up a user
export const signUpUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during sign up:", error);
    return null;
  }
};
