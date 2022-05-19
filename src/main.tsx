import {createBrowserHistory, Outlet, ReactLocation, Router} from "@tanstack/react-location";
import {ChakraProvider, ColorModeScript, createStandaloneToast} from "@chakra-ui/react";
import {useRegisterSW} from "virtual:pwa-register/react";
import {HelmetProvider} from 'react-helmet-async';
import {createRoot} from "react-dom/client";
import React from "react";

import {RouteGenerics, routes} from "pages";
import {theme} from "theme";

const { ToastContainer, toast } = createStandaloneToast();

const location = new ReactLocation<RouteGenerics>({
	history: createBrowserHistory(),
});

const Main: React.FC = () => {
	const {updateServiceWorker} = useRegisterSW({
		onRegistered(_: any) {
			toast({
				position: "bottom",
				isClosable: true,
				description: "Numsgil Co is ready for offline use",
				status: "success",
				duration: 2500,
			});
		},
		onNeedRefresh() {
			toast({
				position: "bottom",
				isClosable: true,
				description: "An update is pending, close this to update app",
				status: "warning",
				duration: null,
				onCloseComplete() {
					updateServiceWorker(true).catch(console.error);
				},
			});
		}
	});

	return <React.StrictMode>
		<ToastContainer />
		<ChakraProvider theme={theme} resetCSS>
			<HelmetProvider>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<Router<RouteGenerics> location={location} routes={routes}>
					<Outlet />
				</Router>
			</HelmetProvider>
		</ChakraProvider>
	</React.StrictMode>;
}

createRoot(document.getElementById("root")!).render(<Main />);
