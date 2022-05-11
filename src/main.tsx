import {createBrowserHistory, Outlet, ReactLocation, Router} from "@tanstack/react-location";
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import {HelmetProvider} from 'react-helmet-async';
import {createRoot} from "react-dom/client";
import React from "react";

import {RouteGenerics, routes} from "pages";
import {theme} from "theme";

const location = new ReactLocation<RouteGenerics>({
	history: createBrowserHistory(),
});

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ChakraProvider theme={theme} resetCSS>
			<HelmetProvider>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<Router<RouteGenerics> location={location} routes={routes}>
					<Outlet />
				</Router>
			</HelmetProvider>
		</ChakraProvider>
	</React.StrictMode>
);
