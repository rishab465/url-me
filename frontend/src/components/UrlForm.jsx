import React, { useState } from "react";
import axios from "axios";

const UrlShortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [customUrl , setcustomUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl("");
    setError("");

    if (!longUrl) return setError("Please enter a URL");

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3000/api/url/create", {
        long_url: longUrl,
        custom_id:customUrl
      });

      if (response.data.short_url) {
        setShortUrl(response.data.short_url);
      } else {
        setError(response.data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-3xl font-bold mb-6">URL Shortener</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter your long URL"
          className="border border-gray-300 rounded px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setcustomUrl(e.target.value)}
          placeholder="custom URL?..."
          className="border border-gray-300 rounded px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {shortUrl && (
        <p className="mt-6 text-lg">
          Short URL:{" "}
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default UrlShortener;
