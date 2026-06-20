import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";

import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <FluentProvider theme={webDarkTheme}>
            <App />
        </FluentProvider>
    </React.StrictMode>
);
