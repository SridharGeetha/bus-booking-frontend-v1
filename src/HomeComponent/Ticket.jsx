import  { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {Button, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { getBooking } from "../Service/service";

export const Ticket = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const busId = searchParams.get("busId");
  const startPoint = searchParams.get("startPoint");
  const destination = searchParams.get("destination");
  const qty = searchParams.get("qty");
  const userId = searchParams.get("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }
    const fetchTicketDetails = async () => {
    const saved = localStorage.getItem(`booked_${sessionId}`);
    if (saved) {
      setTicketDetails(JSON.parse(saved));
      setLoading(false);
    } else if (sessionId) {
      try{

        const ticketData = await getBooking(
          userId,
          busId,
          startPoint,
          destination,
          qty,
          token
        );
      if(ticketData){
        setTicketDetails(ticketData);
        localStorage.setItem(`booked_${sessionId}`, JSON.stringify(ticketData));
        setLoading(false);
      }else{
        return <h1>Failed</h1>
      }
    }catch(error){
      throw error;
    }    
    }
  }
  fetchTicketDetails();
  }, [sessionId, navigate]);

  Font.register({
    family: "Roboto",
    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
  });

  const styles = StyleSheet.create({
    page: { padding: 30, backgroundColor: "#f9fafb" },
    ticket: {
      border: "4pt dashed #9ca3af",
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: "#ffffff",
      position: "relative",
    },
    header: {
      backgroundColor: "#1e40af",
      padding: 20,
      textAlign: "center",
      color: "white",
    },
    title: { fontSize: 28, fontWeight: "bold" },
    body: { padding: 30, paddingTop: 50 },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    label: { fontSize: 11, color: "#6b7280" },
    value: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
    route: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 20,
    },
    fromTo: { fontSize: 22, fontWeight: "bold" },
    arrow: { fontSize: 40, color: "#9ca3af", marginHorizontal: 20 },
    fareBox: {
      backgroundColor: "#fef3c7",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 20,
    },
    fare: { fontSize: 36, fontWeight: "bold", color: "#d97706" },
    barcode: { marginTop: 20, alignItems: "center" },
    footer: {
      marginTop: 30,
      textAlign: "center",
      fontSize: 10,
      color: "#6b7280",
    },
  });

  const TicketPDF = ({ ticket }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.ticket}>
          <View style={styles.header}>
            <Text style={styles.title}>BUS TICKET</Text>
            <Text style={{ fontSize: 12, marginTop: 8 }}>
              Valid for Travel • Non-Transferable
            </Text>
          </View>

          <View style={styles.body}>
            <View style={styles.row}>
              <Text style={styles.label}>Passenger Name</Text>
              <Text style={styles.value}>{ticket.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Booking ID</Text>
              <Text style={{ ...styles.value, color: "#dc2626" }}>
                {ticket.bookingId}
              </Text>
            </View>

            <View style={styles.route}>
              <Text style={{ ...styles.fromTo, color: "#16a34a" }}>
                {ticket.source}
              </Text>
              <Text style={styles.arrow}>→</Text>
              <Text style={{ ...styles.fromTo, color: "#dc2626" }}>
                {ticket.destination}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginVertical: 20,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{ticket.bookingDate}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.label}>Time</Text>
                <Text style={styles.value}>{ticket.bookingTime}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.label}>Seats</Text>
                <Text
                  style={{ ...styles.value, fontSize: 24, color: "#2563eb" }}
                >
                  {ticket.qty}
                </Text>
              </View>
            </View>

            <View style={styles.fareBox}>
              <Text style={{ fontSize: 14, color: "#92400e" }}>
                Total Amount Paid
              </Text>
              <Text style={styles.fare}>{ticket.fare}</Text>
            </View>

            <View style={styles.footer}>
              <Text>Thank you for traveling with us!</Text>
              <Text>Support: support@busbook.com | +91 98765 43210</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-bold">Generating Your Ticket...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-10 px-4">

      <div className="max-w-2xl mx-auto mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="contained"
          color="primary"
        >
          Back to Booking
        </Button>
      </div>

      <div className="max-w-2xl mx-auto" ref={ticketRef}>
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-dashed border-gray-300">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          </div>


          <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white py-8 px-6 text-center">
            <h1 className="text-3xl font-bold tracking-wider">BUS TICKET</h1>
            <p className="text-sm mt-1 opacity-90">
              Valid for Travel • Non-Transferable
            </p>
          </div>

          <div className="p-8 pt-12">
  
            <div className="border-t-2 border-dashed border-gray-400 my-6"></div>

            <div className="grid grid-cols-2 gap-6 text-gray-800">
              <div>
                <p className="text-sm text-gray-500">Passenger Name</p>
                <p className="text-xl font-bold text-indigo-700">
                  {ticketDetails?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="text-lg font-mono font-bold text-red-600">
                  {ticketDetails?.bookingId}
                </p>
              </div>
            </div>

            <Divider sx={{ my: 4, borderColor: "#ddd" }} />

            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-2xl font-bold text-green-600">
                    {ticketDetails?.source}
                  </p>
                </div>
                <div className="text-4xl text-gray-400">→</div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">To</p>
                  <p className="text-2xl font-bold text-red-600">
                    {ticketDetails?.destination}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-lg font-bold">
                    {ticketDetails?.bookingDate}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-lg font-bold">
                    {ticketDetails?.bookingTime}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500">Seats</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {ticketDetails?.qty}
                  </p>
                </div>
              </div>

              <div className="text-center py-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
                <p className="text-sm text-gray-600">Total Amount Paid</p>
                <p className="text-4xl font-bold text-green-600">
                  ₹{ticketDetails?.fare}
                </p>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>Thank you for choosing us! Have a safe journey</p>
              <p>Support: support@busbook.com | +91 98765 43210</p>
            </div>
          </div>
        </div>

        {ticketDetails && (
          <div className="text-center mt-8">
            <PDFDownloadLink
              document={<TicketPDF ticket={ticketDetails} />}
              fileName={`Ticket_${ticketDetails.bookingId}.pdf`}
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(45deg, #1e40af, #3b82f6)",
                    px: 8,
                    py: 3,
                    borderRadius: 3,
                    fontSize: "1.2rem",
                    boxShadow: "0 10px 20px rgba(59,130,246,0.5)",
                  }}
                >
                  {loading ? "Preparing PDF..." : "Download Ticket (PDF)"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
};
