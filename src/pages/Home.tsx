import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FiHome} from "react-icons/fi";
import {VFC} from "react";

import {RouteGenerics} from "./index";

const Page: VFC = () => {
	return <>
		<Helmet>
			<title>Home - Numsgil Co</title>
		</Helmet>
		<p>Home</p>
	</>;
};

const route: Route<RouteGenerics> = {
	path: "home",
	element: <Page />,
	meta: {
		name: "Home",
		icon: FiHome,
	},
};

export default route;
