import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";


export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");

  const API = "http://localhost:5000/articles";

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      const res = await axios.get(API);
      setArticles(res.data);
    } catch (err) {
      console.error("Failed to load articles", err.message);
    }
  }

  const filtered = articles.filter(a =>
    (a.title || "").toLowerCase().includes(search.toLowerCase())
  );
return (
  <div className="dashboard-container">
    <div className="dashboard-header">
      <h1>BeyondChats Articles Dashboard</h1>
      <p>Live data from MySQL database</p>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <h2>Total Articles</h2>
        <div className="value">{articles.length}</div>
      </div>

      <div className="stat-card">
        <h2>Search Results</h2>
        <div className="value">{filtered.length}</div>
      </div>

      <div className="stat-card">
        <h2>Last Updated</h2>
        <div className="value">
          {articles[0]?.created_at ? new Date(articles[0].created_at).toLocaleString() : "N/A"}
        </div>
      </div>
    </div>

    <div className="search-bar">
      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>

    <div className="articles-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Source</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.title}</td>
              <td>
                <a className="source-link" href={a.source_url} target="_blank" rel="noreferrer">
                  View
                </a>
              </td>
              <td>{new Date(a.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <p>No articles found</p>}
    </div>

    <button onClick={loadArticles} className="reload-btn">Reload Data</button>
  </div>
);



}
