import ReactDOM from "react-dom/client";
import React from "react";

import {initJsStore} from "data";
import {App} from "App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
initJsStore();
