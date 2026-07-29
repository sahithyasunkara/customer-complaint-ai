import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    customer_name: "",
    product_name: "",
    batch_number: "",
    complaint_text: "",
  });

  const [analysis, setAnalysis] = useState(null);
  const [complaints, setComplaints] = useState([]);

  // Load complaints from backend
  const loadComplaints = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/complaints/all");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/complaints/",
        form
      );

      setAnalysis(res.data.analysis);

      loadComplaints();

      setForm({
        customer_name: "",
        product_name: "",
        batch_number: "",
        complaint_text: "",
      });

    } catch (err) {
      alert("Error submitting complaint");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>🤖 AI Complaint Management System</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="customer_name"
          placeholder="Customer Name"
          value={form.customer_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={form.product_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="batch_number"
          placeholder="Batch Number"
          value={form.batch_number}
          onChange={handleChange}
          required
        />

        <textarea
          name="complaint_text"
          placeholder="Describe your complaint"
          value={form.complaint_text}
          onChange={handleChange}
          rows="5"
          required
        />

        <button type="submit">Submit Complaint</button>

      </form>

      {analysis && (
        <div className="analysis">
          <h2>🤖 AI Analysis</h2>

          <p><strong>Category:</strong> {analysis.category}</p>

          <p><strong>Priority:</strong> {analysis.priority}</p>

          <p><strong>Sentiment:</strong> {analysis.sentiment}</p>

          <p><strong>Suggested Response:</strong></p>

          <div
            style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {analysis.response}
          </div>
        </div>
      )}

      <hr />

      <h2>Complaint History</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Sentiment</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.customer_name}</td>
              <td>{item.product_name}</td>
              <td>{item.category}</td>
              <td>{item.priority}</td>
              <td>{item.sentiment}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default App;