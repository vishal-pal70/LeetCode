import { Routes, Route, Navigate} from "react-router"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/landingPage"; 
import  { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./component/AdminPanel";
import ProblemPage from "./pages/problemPage";
import Admin from "./pages/Admin";
import AdminDelete from "./component/AdminDelete";
import AdminUpdate from "./component/AdminUpdate";
import AllProblems from "./component/allProblem";
import Achievement from "./component/Achievement";
import StudyPlan from "./component/StudyPlan";
import LearningResources from "./pages/LearningResources";

function App() {
  const dispatch = useDispatch();
  const {isAuthenticated, user, loading} = useSelector((state) => state.auth);

  // Check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <>
      <Routes>
        {/* Landing page for unauthenticated users, home for authenticated */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />} 
        />
        
        <Route 
          path="/home" 
          element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />} 
        />
        
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} 
        />
        
        <Route 
          path="/admin" 
          element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/problem/:problemId" 
          element={<ProblemPage />} 
        />

        <Route 
          path="/problems" 
          element={<AllProblems />} 
        />

        <Route 
          path="/achievements" 
          element={<Achievement />} 
        />

        <Route 
          path="/study-plan" 
          element={<StudyPlan />} 
        />

        <Route 
          path="/resources" 
          element={<LearningResources />} 
        />
        
        <Route 
          path="/admin/create" 
          element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/admin/delete" 
          element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/admin/update" 
          element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} 
        />
      </Routes>
    </>
  )
}

export default App;