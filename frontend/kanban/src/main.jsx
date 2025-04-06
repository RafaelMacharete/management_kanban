import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";
import { GoogleOAuthProvider } from '@react-oauth/google'


// Enviroment variable I NEED TO HIDE THIS

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        {/* <GoogleOAuthProvider clientId={CLIENT_ID}> */}
            <App />
        {/* </GoogleOAuthProvider> */}
    </BrowserRouter>
);