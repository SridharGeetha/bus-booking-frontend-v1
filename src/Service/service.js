import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// const BASE_URL = "http://localhost:8080";

// Auth Service
const login = async (email, password) => {
  try {
    const response = await axios.post(BASE_URL + "/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await axios.post(
      BASE_URL + "/auth/add-new-user",
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//----------------------------------------------------------------------------------------------

//Bus Service
const AddNewBus = async (
  busId,
  route,
  startPoint,
  destination,
  totalFare,
  token
) => {
  try {
    const formData = new FormData();
    formData.append("busId", busId);
    formData.append("route", route);
    formData.append("startPoint", startPoint);
    formData.append("destination", destination);
    formData.append("totalFare", totalFare);
    const response = await axios.post(
      `${BASE_URL}/admin/add-new-bus`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBusById = async (token, id) => {
  try {
    const response = await axios.get(`${BASE_URL}/adminuser/get-bus/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllBusData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/public/get-all-bus`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateBusData = async (token, busId, busData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/admin/update/bus/${busId}`,
      busData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteBusData = async (token, busId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/delete/bus/${busId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//BusStop Service
const AddbusStop = async (stopName, fare, busId, token) => {
  try {
    const formData = new FormData();
    formData.append("busId", busId);
    formData.append("stopName", stopName);
    formData.append("fare", fare);
    const response = await axios.post(
      `${BASE_URL}/admin/add-new-bus-stop`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBusStop = async (token, busId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/adminuser/busStops/${busId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateBusStopData = async (token, busStopId, busStopData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/admin/update/bus/stop/${busStopId}`,
      busStopData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteBusStopData = async (token, busStopId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/bus/stop/delete/${busStopId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Booking Service
const getBooking = async (
  userId,
  busId,
  startPoint,
  destination,
  qty,
  token
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/booking-ticket`,
      {},
      {
        params: { userId, busId, startPoint, destination, ticket: qty },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("BOOKING API ERROR:", error);
    throw error;
  }
};


// payment
const initiatePayment = async ({
  amount,
  qty,
  busId,
  startingPoint,
  endingPoint,
  userId,
  token,
}) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/payment`,
      {
        amount,
        qty,
        busId,
        startingPoint,
        endingPoint,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw error.response?.data || error.message;
  }
};

// Auth Functions
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

const logout = () => {
  localStorage.clear();
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
  localStorage.removeItem("username");
};

const getToken = () => {
  console.log(localStorage.getItem("token"));
  return localStorage.getItem("token");
};

const isAdmin = () => {
  const role = localStorage.getItem("role");
  if (role === "ADMIN") {
    return true;
  } else {
    return false;
  }
};

const isUser = () => {
  const role = localStorage.getItem("role");
  return role == "USER";
};

export {
  login,
  register,
  getBusById,
  getBooking,
  isAuthenticated,
  isAdmin,
  isUser,
  logout,
  getBusStop,
  getAllBusData,
  AddNewBus,
  AddbusStop,
  updateBusData,
  updateBusStopData,
  deleteBusData,
  deleteBusStopData,
  getToken,
  initiatePayment,
};
