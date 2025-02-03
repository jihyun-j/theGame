import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Toast from "./modules/Toast";
import Home from "./pages/Home";
import Test from "./pages/Test";
function App() {
  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
