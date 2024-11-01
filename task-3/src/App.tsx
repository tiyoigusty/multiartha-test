import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/home-page";
import Login from "./pages/login-page";
import Admin from "./pages/admin-page";
import Register from "./pages/register-page";
// import { useDispatch } from "react-redux";
// import { SET_USER } from "./redux/slices/auth";
import axios from "axios";

function App() {
  // const [isLoading, setIsLoading] = useState(true);
  // const dispatch = useDispatch();

  const PrivateRoute = ({ requiredRole }: { requiredRole: string }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // if (isLoading) {
    //   return null;
    // }

    if (token && role === requiredRole) {
      return <Outlet />;
    } else {
      return <Navigate to="/login" />;
    }
  };

  async function authCheck() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/check`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);

        // dispatch(SET_USER(response.data));
      }
    } catch (error) {
      console.log(error);

      localStorage.removeItem("token");
    }
    // finally {
    //   setIsLoading(false);
    // }
  }

  useEffect(() => {
    authCheck();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute requiredRole="Admin" />}>
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        <Route element={<PrivateRoute requiredRole="User" />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
