import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";
import { GoogleOAuthProvider } from '@react-oauth/google'


// Enviroment variable
const CLIENT_ID = '22834506302-dtq4tk3r8h0tnolo49isdsci6k2odem3.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <App />
        </GoogleOAuthProvider>
    </BrowserRouter>
);