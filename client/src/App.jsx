import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import "../node_modules/react-toastify/dist/ReactToastify.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <SocketProvider>
          <ToastContainer />
          <AppRoutes />
        </SocketProvider>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
