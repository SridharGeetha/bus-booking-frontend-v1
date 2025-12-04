import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import {
  getAllBusData,
  getBusById,
  getBusStop,
  initiatePayment,
  isAuthenticated,
} from "../Service/service";
import { InfiniteMovingCards } from "./InfiniteMovingCards ";
import AppNotification from "../Component/AppNotification";
import { loadStripe } from "@stripe/stripe-js";
import { useLoading } from "../Context/LoadingProvider";
import { SparklesCore } from "./sparkles";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const Home = () => {
  const { loading, setLoading } = useLoading(); 
  const [busId, setBusId] = useState();
  const [busData, setBusData] = useState();
  const [busStopData, setbusStopData] = useState([]);
  const [startingPoint, setStartingPoint] = useState("");
  const [endingPoint, setEndingPoint] = useState("");
  const [calculatedFare, setCalculatedFare] = useState(0);
  const [fare, setFare] = useState(0);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  const [allBuses, setAllBuses] = useState([]);

  useEffect(() => {
    const fetchAllBuses = async () => {
      setLoading(true);
      try {
        const buses = await getAllBusData();
        setAllBuses(buses || []);
      } catch (err) {
        console.error("Failed to load buses for carousel", err);
        setAllBuses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBuses();
  }, []);

  useEffect(() => {
    if (!busId) return;
    const fetchBusStops = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await getBusStop(token, busId);
        if (response) {
          setbusStopData(response);
        } else {
          setError("Error fetching bus stops");
        }
      } catch (error) {
        setError("Failed to load bus stops");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusStops();
  }, [busData]);

  const handleSearchBus = async (e) => {
    if (!isAuthenticated()) {
      setMessage({
        type: "info",
        title: "Authentication Required",
        text: "Please Login First to search buses.",
      });
      return;
    }
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const busData = await getBusById(token, busId);
      setBusData(busData);
    } catch (error) {
      console.log(error);
      setBusData(null);
      setError("Bus not found. Please check the Bus ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (startingPoint && endingPoint && busStopData.length > 0) {
      if (startingPoint === endingPoint) {
        setCalculatedFare(0);
      } else {
        const startStop = busStopData.find(
          (stop) => stop.stopName === startingPoint
        );
        const endStop = busStopData.find(
          (stop) => stop.stopName === endingPoint
        );

        if (startStop && endStop) {
          const fare = Math.abs(
            endStop.fareFromStart - startStop.fareFromStart
          );
          setFare(fare);
          setCalculatedFare(qty * fare);
        }
      }
    }
  }, [startingPoint, endingPoint, busStopData, qty]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!startingPoint || !endingPoint || calculatedFare <= 0) {
      AppNotification(
        "warning",
        "Invalid Selection",
        "Please select valid boarding and dropping points."
      );
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      if (!token || !userId) {
        AppNotification("error", "Login Required", "Please log in to proceed.");
        setLoading(false);
        return;
      }
      AppNotification(
        "info",
        "Preparing Payment",
        "Please wait while we redirect you to Stripe..."
      );
      const session = await initiatePayment({
        amount: fare,
        qty,
        busId,
        startingPoint,
        endingPoint,
        userId,
        token,
      });
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
      if (error) {
        AppNotification("error", "Redirect Failed", error.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      AppNotification(
        "error",
        "Payment Failed",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20  relative min-h-screen overflow-x-hidden bg-linear-to-t from-blue-700 to-slate-950 text-white">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.6}
          particleDensity={100}
          className="w-full h-full absolute inset-0"
          particleColor="#00ffff"
        />
        <section className="relative py-16 px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-linear-to-r from-[#00b4db] to-[#0083b0] bg-clip-text text-transparent mb-4 inline-block">
              Book Your Bus Journey
              <span className="block text-2xl md:text-3xl font-medium text-gray-400 mt-2">
                Fast, Safe & Comfortable
              </span>
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Find the best bus routes and book your tickets in just a few
              clicks. Enjoy seamless travel with our online booking system.
            </p>
          </div>
        </section>

        <section className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <div className="backdrop-blur-md bg-transparent border border-cyan-400/30 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">
              Find Your Bus
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              <div
                className="flex flex-col md:flex-row gap-4 items-center bg-transparent border border-cyan-400 
                  rounded-full p-3 w-full 
                  focus-within:ring-4  focus-within:ring-cyan-400/30 transition-all"
              >
                <input
                  type="text"
                  placeholder="Enter Bus ID (e.g., 101)"
                  onChange={(e) => setBusId(e.target.value)}
                  className="w-full md:flex-1 bg-transparent text-cyan-300 placeholder:text-gray-400 
                 text-lg px-4  outline-none"
                />
              </div>

              <button
                onClick={handleSearchBus}
                className="w-full md:w-40 bg-blue-500 shadow-md shadow-blue-500/50 
               hover:bg-blue-600 text-white font-medium py-4 rounded-3xl 
               transition duration-200"
              >
                Search Bus
              </button>
            </div>

            {error && !busData && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-2 mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <span className="loader"></span>
            ) : (
              <>
                {busData && (
                  <div className="bg-white/10 border border-cyan-500/30 rounded-2xl p-6 mb-8 mt-10">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Bus Route
                    </h3>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <span className="text-2xl font-bold text-white">
                        {busData.route}
                      </span>
                      <span className="text-gray-300">Bus ID: {busId}</span>
                    </div>
                  </div>
                )}

                {busData && busStopData.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-center mb-8 text-white drop-shadow">
                      Plan Your Journey
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Starting Point
                        </label>
                        <select
                          value={startingPoint}
                          onChange={(e) => setStartingPoint(e.target.value)}
                          className="w-full bg-white/15 border-2 border-cyan-500/40 rounded-xl px-4 py-4 text-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 outline-none backdrop-blur-md shadow-lg transition-all"
                        >
                          <option value="">Select Source</option>
                          {busStopData.map((stop) => (
                            <option
                              key={stop.stopId}
                              value={stop.stopName}
                              className="bg-cyan-900/90 text-white py-3"
                            >
                              {stop.stopName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Ending Point
                        </label>
                        <select
                          value={endingPoint}
                          onChange={(e) => setEndingPoint(e.target.value)}
                          className="w-full bg-white/15 border-2 border-cyan-500/40 rounded-xl px-4 py-4 text-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 outline-none backdrop-blur-md shadow-lg transition-all"
                        >
                          <option value="">Select Destination</option>
                          {busStopData.map((stop) => (
                            <option
                              key={stop.stopId}
                              value={stop.stopName}
                              className="bg-cyan-900/90 text-white py-3"
                            >
                              {stop.stopName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Passengers
                        </label>
                        <div className="flex items-center gap-4 bg-white/15 border-2 border-gray-800/40 rounded-xl px-4 py-3 backdrop-blur-md shadow-lg">
                          <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            disabled={qty <= 1}
                            className="w-10 h-10 rounded-full bg-linear-to-r from-[#00b4db] to-[#0083b0] text-white font-bold hover:scale-110 disabled:opacity-50 transition-all shadow-md"
                          >
                            -
                          </button>
                          <span className="text-xl font-bold text-white w-12 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => setQty(qty + 1)}
                            className="w-10 h-10 rounded-full bg-linear-to-r from-[#00b4db] to-[#0083b0] text-white font-bold hover:scale-110 transition-all shadow-md"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {startingPoint && endingPoint && calculatedFare > 0 && (
                      <div className="text-center bg-white/10 border-2 border-cyan-500/30 rounded-xl py-4 mb-6 backdrop-blur-md">
                        <span className="text-white text-lg">Total Amount</span>
                        <span className="text-3xl font-bold text-cyan-300 ml-4">
                          ₹{calculatedFare}
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <button
                        onClick={handlePayment}
                        disabled={
                          !startingPoint ||
                          !endingPoint ||
                          calculatedFare <= 0 ||
                          loading
                        }
                        className="bg-linear-to-r from-[#00b4db] to-[#0083b0] hover:shadow-2xl hover:shadow-cyan-500/50 text-white font-bold text-lg px-12 py-5 rounded-full transition-all hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-3"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>Pay ₹{calculatedFare}</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="relative z-10 py-16">
          <div className="h-96 rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
            {allBuses.length > 0 ? (
              <InfiniteMovingCards
                items={allBuses}
                direction="left"
                speed="slow"
              />
            ) : (
              <p className="text-gray-400 text-lg">
                No buses available right now.
              </p>
            )}
          </div>
        </section>
      </div>
      {message && (
        <div className="fixed top-20 right-4 z-50 duration-5">
          <AppNotification
            type={message.type}
            title={message.title}
            message={message.text}
          />
        </div>
      )}
    </>
  );
};
