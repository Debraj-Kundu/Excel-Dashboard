import "./App.css";
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// import PivotTable from "./pages/PivotTable";
// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import UploadFileForm from "./pages/UploadFileForm";
// import Test from "./components/Test";
const PivotTable = lazy(() => import("./pages/PivotTable"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const UploadFileForm = lazy(() => import("./pages/UploadFileForm"));
const Test = lazy(() => import("./components/Test"));

function App() {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadFileForm />} />
          <Route path="/scratch" element={<Test isEditMode={true} />} />
          <Route path="/view/:id" element={<PivotTable isEditMode={false} />} />
          <Route path="/edit/:id" element={<PivotTable isEditMode={true} />} />
          <Route path="/login" element={<Login login={true} />} />
          <Route path="/register" element={<Login login={false} />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
