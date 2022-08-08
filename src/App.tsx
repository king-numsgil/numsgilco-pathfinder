import {createBrowserHistory, Outlet, ReactLocation, Router} from "@tanstack/react-location";
import {ChakraProvider, ColorModeScript, createStandaloneToast} from "@chakra-ui/react";
import {useRegisterSW} from "virtual:pwa-register/react";
import {HelmetProvider} from 'react-helmet-async';
import {FC} from "react";

import {routes} from "pages";
import {theme} from "theme";

const {ToastContainer, toast} = createStandaloneToast();

const location = new ReactLocation({
	history: createBrowserHistory(),
});

export const App: FC = () => {
	const {updateServiceWorker} = useRegisterSW({
		onRegistered(_: any) {
			console.log("ServiceWorker registered");
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
		},
	});

	return <>
		<ToastContainer />
		<ChakraProvider theme={theme} resetCSS>
			<HelmetProvider>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<Router location={location} routes={routes}>
					<Outlet />
				</Router>
			</HelmetProvider>
		</ChakraProvider>
	</>;
};
