import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import GlobalModal from "./components/GlobalModal/GlobalModal";
import Header from "./components/header";
import Toast from "./modules/Toast";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Test from "./pages/Test";
import AuthProvider from "./provider/AuthProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Toast />
          <GlobalModal />
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/game/:id' element={<Game />} />
            <Route path='/test' element={<Test />} />
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
