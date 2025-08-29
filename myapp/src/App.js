import React, { useEffect, useState } from "react";
import axios from "axios";
import './StudentCrud.css';

const StudentCrud = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    city: "",
    address: "",
    birth_date: "",
    is_active: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/students/"; // Django endpoint
  const cities = ["Pune", "Mumbai", "Delhi", "Bangalore"];

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Form change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Submit form (Add / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // PUT request for update
        await axios.put(`${API_URL}${formData.id}/`, formData);
      } else {
        // POST request for create
        await axios.post(API_URL, formData);
      }
      fetchStudents();
      handleReset();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setFormData(student);
    setIsEditing(true);
    setViewStudent(null);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchStudents();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({ id: null, name: "", city: "", address: "", birth_date: "", is_active: false });
    setIsEditing(false);
    setViewStudent(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Student CRUD</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="border p-4 rounded space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        />

        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className="border p-2 w-full rounded"
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          type="date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <label className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <span className="ml-2">Is Active</span>
        </label>

        <div className="flex space-x-3">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {isEditing ? "Update" : "Submit"}
          </button>
          <button type="button" onClick={handleReset} className="bg-gray-400 text-white px-4 py-2 rounded">
            Reset
          </button>
        </div>
      </form>

      {/* Student List */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Student List</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Birth Date</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.city}</td>
              <td className="p-2 border">{s.birth_date}</td>
              <td className="p-2 border">{s.is_active ? "Yes" : "No"}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => setViewStudent(s)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Student */}
      {viewStudent && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <h3 className="text-lg font-bold mb-2">Student Details</h3>
          <p><b>Name:</b> {viewStudent.name}</p>
          <p><b>City:</b> {viewStudent.city}</p>
          <p><b>Address:</b> {viewStudent.address}</p>
          <p><b>Birth Date:</b> {viewStudent.birth_date}</p>
          <p><b>Active:</b> {viewStudent.is_active ? "Yes" : "No"}</p>
          <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2 rounded mt-2">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentCrud;
