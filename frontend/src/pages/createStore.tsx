import React, { useState } from "react";
import { request } from "../utils/axiosInstance";

export const CreateStore = () => {
  const [name, setName] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [currency, setCurrency] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await request.post("/stores", {
        name,
        timeZone,
        currency,
      });
      console.log(res);
    } catch (err: any) {
      console.error("Error Creating Store", err);
    }
  };
  const resetForm = () => {};
  return (
    <form onSubmit={handleSubmit} className="bg-white">
      <div className="space-x-2">
        <label>Store Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Store Name"
          className="border rounded"
          required
        />
      </div>
      <div className="space-x-2">
        <label>Time Zone:</label>
        <input
          type="text"
          value={timeZone}
          onChange={(e) => setTimeZone(e.target.value)}
          placeholder="Select TimeZone"
          className="border rounded"
          required
        />
      </div>
      <div className="space-x-2">
        <label>Currency:</label>
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder="Select Currency"
          className="border rounded"
          required
        />
      </div>
      <button type="submit" className="border bg-gray-50">
        Submit
      </button>
    </form>
  );
};
