import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Toast from "./modules/Toast";
import Home from "./pages/Home";
import Test from "./pages/Test";
import AuthProvider from "./provider/AuthProvider";
import Header from "./components/header";
import GlobalModal from "./components/GlobalModal/GlobalModal";
import Game from "./pages/Game";

function App() {
  return (
    <BrowserRouter>
      <Toast />
      <GlobalModal />
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
