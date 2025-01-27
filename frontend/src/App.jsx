import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import MenuAppBar from "../components/MenuAppBar";
import UserHome from "../userpages/UserHome";
import AdminHome from "../adminpages/AdminHome";
import UserPrivateComponent from "../components/UserPrivateComponent";
import AdminPrivateComponent from "../components/AdminPrivateComponent";
import BlogDetails from "../userpages/BlogDetails";
import BlogDetailsAdmin from "../adminpages/BlogDetailsAdmin";
import AddBlog from "../adminpages/AddBlog";

function App() {
  return (
    <div>
      <Router>
        <MenuAppBar />
        <Routes>
          <Route element={<UserPrivateComponent />}>
            {/* User Specific Private Routes */}
            <Route path="/userhome" element={<UserHome />} />
            <Route path="/blog/:id" element={<BlogDetails />} />{" "}
          </Route>
          <Route element={<AdminPrivateComponent />}>
            {/* Admin Specific Private Routes */}
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/add" element={<AddBlog />} />
            <Route path="/blogadmin/:id" element={<BlogDetailsAdmin />} />{" "}
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to={"/login"} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
