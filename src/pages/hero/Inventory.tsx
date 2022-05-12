import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {RouteGenerics} from "../index";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Hero Inventory - Numsgil Co</title>
		</Helmet>
		<p>Hero Inventory</p>
	</>;
};

const route: Route<RouteGenerics> = {
	path: "inventory",
	element: <Page />,
	meta: {},
};

export default route;
