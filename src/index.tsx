import React from 'react'
import {createRoot} from "react-dom/client";
import {CSSProvider} from '@master/css.react'
import config from '../master.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from './routes/App'
import Options from "./routes/Options";
import WaterContextProvider from "./context/WaterContext.tsx";
import '@master/keyframes.css'


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "/options",
        element: <Options/>
    }
], {
    basename: import.meta.env.BASE_URL
})

const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <React.StrictMode>
        <CSSProvider config={config}>
            <WaterContextProvider>
                <RouterProvider router={router}/>
            </WaterContextProvider>
        </CSSProvider>
    </React.StrictMode>
)