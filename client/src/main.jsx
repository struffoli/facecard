import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./state/store.js";
import PrivateRoute from "./components/PrivateRoute.jsx";
import WelcomePage from "./screens/welcomePage.jsx";
import HomePage from "./screens/homePage.jsx";
import LoginPage from "./screens/loginPage.jsx";
import ProfilePage from "./screens/profilePage.jsx";
import CardPage from "./screens/cardPage.jsx";
import ProductPage from "./screens/productPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/card/:cardId" element={<CardPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
