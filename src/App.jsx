import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");

  const BASE_URL = "https://exambackend-wabs.onrender.com";


  const fetchBooks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/books`);
      const result = await res.json();
      if (result.success) setBooks(result.data);
      else setBooks([]);
    } catch (err) {
      console.error(" Error fetching books:", err);
    }
  };


  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${BASE_URL}/addbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        setMessage(" Book added successfully!");
        fetchBooks(); 
        reset();
      } else {
        setMessage(" Failed to add book");
      }
    } catch (err) {
      console.error(" Backend not reachable:", err);
      setMessage("Backend not available");
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const res = await fetch(`${BASE_URL}/deletebook/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        setMessage(" Book deleted successfully!");
        fetchBooks();
      } else {
        setMessage(" Failed to delete book");
      }
    } catch (err) {
      console.error(" Error deleting book:", err);
      setMessage("Backend not available");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Book Management App</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "20px" }}>
        <label>Book Name:</label>
        <input
          {...register("name", { required: "Book name is required" })}
          placeholder="Enter book name"
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        <br /><br />

        <label>Total Pages:</label>
        <input
          type="number"
          {...register("pages", { required: "Page count required" })}
          placeholder="Enter total pages"
        />
        {errors.pages && <p style={{ color: "red" }}>{errors.pages.message}</p>}
        <br /><br />

        <label>Reference Email:</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="Enter reference email"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        <br /><br />

        <button type="submit">Add Book</button>
      </form>

      {message && <p>{message}</p>}

      <hr />
      <h3> All Books</h3>

      {books.length === 0 ? (
        <p>No books found</p>
      ) : (
        books.map((book) => (
          <div
            key={book._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p><b>ID:</b> {book._id}</p>
            <p><b> {book.name}</b></p>
            <p>Pages: {book.pages}</p>
            <p>Reference: {book.email}</p>
            <button
              onClick={() => handleDelete(book._id)}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
