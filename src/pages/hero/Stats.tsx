import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {VFC} from "react";

import {RouteGenerics} from "../index";

const Page: VFC = () => {
	return <>
		<Helmet>
			<title>Hero Stats - Numsgil Co</title>
		</Helmet>
		<p>Hero Stats</p>
	</>;
};

const route: Route<RouteGenerics> = {
	path: "stats",
	element: <Page />,
	meta: {},
};

export default route;
