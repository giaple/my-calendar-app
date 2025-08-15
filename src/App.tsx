import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./App.css"; // ⬅ custom styles

const API_URL = "https://my-calendar-backend-ckk6.onrender.com";

type EventsMap = Record<string, string>;

export default function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [name, setName] = useState<string>("");
  const [events, setEvents] = useState<EventsMap>({});

  useEffect(() => {
    axios
      .get<EventsMap>(`${API_URL}/events`)
      .then((res) => setEvents(res.data));
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    const dateKey = date.toISOString().split("T")[0];
    await axios.post(`${API_URL}/events`, { date: dateKey, name });
    setEvents((prev) => ({ ...prev, [dateKey]: name }));
    setName("");
  };

  return (
    <div className="app-container">
      <div className="calendar-wrapper">
        <h1>📅 KIG</h1>

        <Calendar
          value={date}
          onChange={(value) => setDate(value as Date)}
          minDate={new Date()}
          tileContent={({ date }) => {
            const dateKey = date.toISOString().split("T")[0];
            return events[dateKey] ? (
              <div style={{ fontSize: "0.6em", color: "blue" }}>
                {events[dateKey]}
              </div>
            ) : null;
          }}
        />

        <div className="input-section">
          <h3>
            Ngày đã chọn:{" "}
            {date.toLocaleDateString("vi-VN", {
              weekday: "long", // Thứ
              year: "numeric", // Năm
              month: "long", // Tháng
              day: "numeric", // Ngày
            })}
          </h3>
          <input
            type="text"
            placeholder="Nhập Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleSave}>Lưu</button>
        </div>
      </div>
    </div>
  );
}
