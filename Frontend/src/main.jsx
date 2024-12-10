import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { Auth0Provider } from '@auth0/auth0-react'
import { Auth0ProviderWithNavigate } from "./auth0-provider-with-navigate";
import {BrowserRouter} from "react-router-dom"


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Auth0ProviderWithNavigate>
            <App />
        </Auth0ProviderWithNavigate>
    </BrowserRouter>
)
