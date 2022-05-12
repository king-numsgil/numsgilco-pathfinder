import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {RouteGenerics} from "../index";

const Page: FC = () => {
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
