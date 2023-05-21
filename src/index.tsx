import App from './App'
import React from 'react'
import {createRoot} from "react-dom/client";
import {CSSProvider} from '@master/css.react'
import config from '../master.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Options from "./routes/Options.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "/options",
        element: <Options/>
    }
])

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <React.StrictMode>
        <CSSProvider config={config}>
            <RouterProvider router={router}/>
        </CSSProvider>
    </React.StrictMode>
)