import App from './App'
import React from 'react'
import {createRoot} from "react-dom/client";
import {CSSProvider} from '@master/css.react'
import {config} from '../master.css'


const root = createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <React.StrictMode>
        <CSSProvider config={config}>
            <App/>
        </CSSProvider>
    </React.StrictMode>
    )