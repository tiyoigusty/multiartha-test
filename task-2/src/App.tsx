import axios from "axios";
import { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: question }],
          max_tokens: 100,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      setResponse(res.data.choices[0].message.content);
      console.log(res.data.choices[0].message.content);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          `Error: ${error.response?.data?.error?.message || error.message}`
        );
      } else {
        setError("Gagal mendapatkan respons dari API. Coba lagi.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>ChatGPT API Integration</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={question}
          onChange={handleInputChange}
          placeholder="Tanyakan sesuatu..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Kirim
        </button>
      </form>
      {response && (
        <p style={styles.response}>
          <strong>Respons:</strong> {response}
        </p>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "600px",
  },
  input: {
    width: "100%",
    padding: "12px 20px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #CCCCCC",
    backgroundColor: "#2D2D2D",
    color: "#FFFFFF",
    fontSize: "16px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "8px",
    color: "#FFFFFF",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  response: {
    marginTop: "20px",
    backgroundColor: "#2D2D2D",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "600px",
    wordWrap: "break-word",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  error: {
    marginTop: "20px",
    color: "#FF4C4C",
  },
};

export default App;
