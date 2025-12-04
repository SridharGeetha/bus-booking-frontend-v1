import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddNewBus,
  getAllBusData,
  getBusStop,
  AddbusStop,
  updateBusData,
  updateBusStopData,
  deleteBusStopData,
  deleteBusData,
  logout,
} from "../Service/service";
import { TypewriterEffect } from "./TypewriterEffect";
import AppNotification from "../Component/AppNotification";
import { useLoading } from "../Context/LoadingProvider";

export const AdminDashBoard = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();
  const token = localStorage.getItem("token");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [existbuses, setExistBuses] = useState([]);
  const [busStops, setBusStops] = useState({});
  const [newBusData, setNewBusData] = useState({
    busId: "",
    route: "",
    startingPoint: "",
    endingPoint: "",
    totalFare: "",
  });
  const [newBusStop, setNewBusStop] = useState({ stopName: "", fare: "" });

  const [addBusExpanded, setAddBusExpanded] = useState(false);
  const [addStopExpanded, setAddStopExpanded] = useState({});
  const [busExpanded, setBusExpanded] = useState({});
  const [editBusOpen, setEditBusOpen] = useState(false);
  const [editStopOpen, setEditStopOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [message, setMessage] = useState(null);

  const words = [
    {
      text: "Welcome-",
      className: "pr-2",
    },
    {
      text: "ADMIN.",
      className: "text-blue-300 dark:text-blue-500",
    },
  ];

  const email = localStorage.getItem("email");
  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const res = await getAllBusData(token);
      setExistBuses(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusStops = async (busId) => {
    if (busStops[busId]) return;
    setLoading(true);
    try {
      const res = await getBusStop(token, busId);
      setBusStops((prev) => ({ ...prev, [busId]: res || [] }));
    } catch (err) {
      console.error("Error fetching stops:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBusExpand = (busId) => {
    setBusExpanded((prev) => ({ ...prev, [busId]: !prev[busId] }));
    if (!busStops[busId]) {
      fetchBusStops(busId);
    }
  };

  const handleAddBus = async () => {
    setLoading(true);
    try {
      await AddNewBus(
        newBusData.busId,
        newBusData.route,
        newBusData.startingPoint,
        newBusData.endingPoint,
        newBusData.totalFare,
        token
      );
      fetchBuses();
      setNewBusData({
        busId: "",
        route: "",
        startingPoint: "",
        endingPoint: "",
        totalFare: "",
      });
      setAddBusExpanded(false);
      setMessage({
        type: "success",
        title: "Success",
        text: "Bus Added Successfully",
      });
    } catch (err) {
      setMessage({
        type: "error",
        title: "Failed",
        text: "Failed to add bus",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBusStop = async (busId) => {
    setLoading(true);
    try {
      await AddbusStop(newBusStop.stopName, newBusStop.fare, busId, token);
      fetchBusStops(busId);
      setNewBusStop({ stopName: "", fare: "" });
      setAddStopExpanded((prev) => ({ ...prev, [busId]: false }));
      setMessage({
        type: "success",
        title: "Success",
        text: "Bus Stop Added Successfully",
      });
    } catch (err) {
      setMessage({
        type: "error",
        title: "Failed",
        text: "Failed to add bus stop",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBus = async () => {
    if (!selectedBus) return;
    setLoading(true);
    await updateBusData(token, selectedBus.busId, selectedBus);
    fetchBuses();
    setEditBusOpen(false);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedBus && busStops.length > 0) {
      handleUpdateBus();
    }
  }, [existbuses]);

  const handleDeleteBus = async (busId) => {
    if (window.confirm("Delete this bus?")) {
      setLoading(true);
      try {
        await deleteBusData(token, busId);
        fetchBuses();
        setLoading(false);
        setMessage({
          type: "info",
          title: "Deleted",
          text: "Bus deleted successfully!",
        });
      } catch (error) {
        setMessage({
          type: "error",
          title: "Error",
          text: "Failed to delete bus!",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateBusStop = async () => {
    setLoading(true);
    const updated = { ...selectedStop, busId: selectedStop.busId };
    await updateBusStopData(token, selectedStop.stopId, updated);
    fetchBusStops(selectedStop.busId);
    setEditStopOpen(false);
    setMessage({
      type: "success",
      title: "Success",
      text: "Bus stop updated successfully!",
    });
    setLoading(false);
  };

  useEffect(() => {
    if (selectedBus && busStops.length > 0) {
      fetchBusStops(selectedBus.busId);
    }
  }, [busStops]);

  const handleDeleteBusStop = async (stopId, busId) => {
    if (window.confirm("Delete this stop?")) {
      setLoading(true);
      try {
        await deleteBusStopData(token, stopId);
        fetchBusStops(busId);
        setLoading(false);
        setMessage({
          type: "warning",
          title: "deleted",
          text: "Stop deleted successfully!",
        });
      } catch (error) {
        setMessage({
          type: "error",
          title: "Error",
          text: "Failed to delete stop!",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleHome = () => navigate("/");

  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#0a0e27] via-[#1a1a2e] to-[#16213e] text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-[#0a0e27] via-[#1a1a2e] to-[#16213e] shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
        style={{ borderRight: "1px solid rgba(0, 180, 219, 0.3)" }}
      >
        <div className="flex items-center justify-between p-6 lg:hidden">
          <h2 className="text-2xl font-bold text-cyan-400">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-cyan-400"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-8 pb-6 text-center border-b border-cyan-500/20 flex-shrink-0">
          <button
            onClick={handleHome}
            className="mb-2 mr-40 p-3 cursor-pointer bg-white/10 rounded-full hover:bg-white/20 transition inline-block"
          >
            <svg
              className="w-3 h-3 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <svg
                className="w-14 h-14 text-cyan-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <p className="font-semibold">Admin Dashboard</p>
          <p className="text-sm text-cyan-300 mt-1">{email}</p>
        </div>
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center gap-4 px-6 py-3.5 rounded-xl text-left transition-all duration-300 bg-linear-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/20 font-medium">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="text-base">Dashboard</span>
                <div className="ml-auto w-1 h-8 bg-cyan-400 rounded-full"></div>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mb-6 p-3 bg-white/10 rounded-full hover:bg-white/20"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-4xl font-bold mb-10 drop-shadow-lg">
          <TypewriterEffect words={words} />
        </h1>
        {loading ? (
          <span className="loader1 text-2xl"></span>
        ) : (
          <>
            <div className="bg-white/5 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 mb-8 shadow-2xl">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setAddBusExpanded(!addBusExpanded)}
              >
                <h2 className="text-2xl font-bold text-cyan-300">
                  Add New Bus
                </h2>
                <svg
                  className={`w-8 h-8 text-cyan-400 transition-transform ${addBusExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {addBusExpanded && (
                <div className="mt-6 space-y-4">
                  {[
                    "busId",
                    "route",
                    "startingPoint",
                    "endingPoint",
                    "totalFare",
                  ].map((field) => (
                    <input
                      key={field}
                      type={field === "totalFare" ? "number" : "text"}
                      placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                      value={newBusData[field]}
                      onChange={(e) =>
                        setNewBusData({
                          ...newBusData,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full px-5 py-4 bg-white/10 border border-cyan-500/40 rounded-xl focus:border-cyan-400 focus:outline-none transition placeholder-gray-400"
                    />
                  ))}
                  <button
                    onClick={handleAddBus}
                    className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                  >
                    Add Bus
                  </button>
                </div>
              )}
            </div>

            {existbuses.map((bus) => (
              <div
                key={bus.busId}
                className="bg-white/5 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 mb-6 shadow-2xl"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl text-cyan-400">Bus</div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {bus.busId} - {bus.route}
                      </h3>
                      <p className="text-gray-300">
                        Start: {bus.startingPoint} → End: {bus.endingPoint} |
                        Total Fare: ₹{bus.totalFare}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedBus(bus);
                        setEditBusOpen(true);
                      }}
                      className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleBusExpand(bus.busId)}
                      className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${busExpanded[bus.busId] ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteBus(bus.busId)}
                      className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition cursopo"
                    >
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2.375 2.375 0 0115.963 21H8.037a2.375 2.375 0 01-2.17-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {busExpanded[bus.busId] && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <button
                      onClick={() =>
                        setAddStopExpanded((prev) => ({
                          ...prev,
                          [bus.busId]: !prev[bus.busId],
                        }))
                      }
                      className="mb-4 px-5 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition font-medium"
                    >
                      {addStopExpanded[bus.busId] ? "Cancel" : "+ Add New Stop"}
                    </button>

                    {addStopExpanded[bus.busId] && (
                      <div className="flex gap-4 mb-8 flex-wrap bg-white/5 p-5 rounded-xl">
                        <input
                          placeholder="Stop Name"
                          value={newBusStop.stopName}
                          onChange={(e) =>
                            setNewBusStop({
                              ...newBusStop,
                              stopName: e.target.value,
                            })
                          }
                          className="flex-1 min-w-[220px] px-5 py-3 bg-white/10 border border-cyan-500/40 rounded-xl focus:border-cyan-400 outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Fare from Start"
                          value={newBusStop.fare}
                          onChange={(e) =>
                            setNewBusStop({
                              ...newBusStop,
                              fare: e.target.value,
                            })
                          }
                          className="w-40 px-5 py-3 bg-white/10 border border-cyan-500/40 rounded-xl focus:border-cyan-400 outline-none"
                        />
                        <button
                          onClick={() => handleAddBusStop(bus.busId)}
                          className="px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl font-bold hover:shadow-lg transition"
                        >
                          Add Stop
                        </button>
                      </div>
                    )}
                    {busStops[bus.busId] && busStops[bus.busId].length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="text-xl font-semibold text-cyan-300 mb-3">
                          All Stops
                        </h4>
                        {busStops[bus.busId].map((stop) => (
                          <div
                            key={stop.stopId}
                            className="flex justify-between items-center bg-white/5 p-4 rounded-xl hover:bg-white/10 transition"
                          >
                            <div>
                              <p className="font-medium text-lg">
                                {stop.stopName}
                              </p>
                              <p className="text-sm text-gray-400">
                                Fare from Start: ₹{stop.fareFromStart}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setSelectedStop({
                                    ...stop,
                                    busId: bus.busId,
                                  });
                                  setEditStopOpen(true);
                                }}
                                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteBusStop(stop.stopId, bus.busId)
                                }
                                className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 transition"
                              >
                                <svg
                                  className="w-5 h-5 text-red-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2.375 2.375 0 0115.963 21H8.037a2.375 2.375 0 01-2.17-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : busStops[bus.busId] === undefined ? (
                      <p className="text-gray-400 italic">Loading stops...</p>
                    ) : (
                      <p className="text-gray-400 italic">
                        No stops added yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {editBusOpen && selectedBus && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setEditBusOpen(false)}
              >
                <div
                  className="bg-linear-to-br from-[#1a1a2e] to-[#16213e] border border-cyan-500/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-3xl font-bold text-cyan-300 mb-6">
                    Update Bus
                  </h2>
                  <div className="space-y-4">
                    <input
                      disabled
                      value={selectedBus.busId}
                      className="w-full px-5 py-4 bg-white/10 rounded-xl text-gray-400"
                    />
                    {["route", "startingPoint", "endingPoint", "totalFare"].map(
                      (field) => (
                        <input
                          key={field}
                          placeholder={field.replace(/([A-Z])/g, " $1")}
                          value={selectedBus[field] || ""}
                          onChange={(e) =>
                            setSelectedBus({
                              ...selectedBus,
                              [field]: e.target.value,
                            })
                          }
                          className="w-full px-5 py-4 bg-white/10 border border-cyan-500/40 rounded-xl focus:border-cyan-400 focus:outline-none"
                        />
                      )
                    )}
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setEditBusOpen(false)}
                      className="flex-1 py-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateBus}
                      className="flex-1 py-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl font-bold hover:shadow-lg transition"
                    >
                      Update Bus
                    </button>
                  </div>
                </div>
              </div>
            )}

            {editStopOpen && selectedStop && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setEditStopOpen(false)}
              >
                <div
                  className="bg-linear-to-br from-[#1a1a2e] to-[#16213e] border border-cyan-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-3xl font-bold text-cyan-300 mb-6">
                    Update Stop
                  </h2>
                  <input
                    placeholder="Stop Name"
                    value={selectedStop.stopName || ""}
                    onChange={(e) =>
                      setSelectedStop({
                        ...selectedStop,
                        stopName: e.target.value,
                      })
                    }
                    className="w-full mb-4 px-5 py-4 bg-white/10 border border-cyan-500/40 rounded-xl focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Fare from Start"
                    value={selectedStop.fareFromStart || ""}
                    onChange={(e) =>
                      setSelectedStop({
                        ...selectedStop,
                        fareFromStart: e.target.value,
                      })
                    }
                    className="w-full px-5 py-4 bg-white/10 border border-cyan-500/40 rounded-xl focus:border-cyan-400 focus:outline-none"
                  />
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setEditStopOpen(false)}
                      className="flex-1 py-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateBusStop}
                      className="flex-1 py-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl font-bold hover:shadow-lg transition"
                    >
                      Update Stop
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      {message && (
        <div className="fixed top-10 right-4 z-50 duration-5">
          <AppNotification
            type={message.type}
            title={message.title}
            message={message.text}
          />
        </div>
      )}
    </div>
  );
};
