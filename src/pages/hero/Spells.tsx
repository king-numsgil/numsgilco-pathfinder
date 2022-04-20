import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {VFC} from "react";

import {RouteGenerics} from "../index";

const Page: VFC = () => {
	return <>
		<Helmet>
			<title>Hero Spells - Numsgil Co</title>
		</Helmet>
		<p>Hero Spells</p>
	</>;
};

const route: Route<RouteGenerics> = {
	path: "spells",
	element: <Page />,
	meta: {},
};

export default route;
