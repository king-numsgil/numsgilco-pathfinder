import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {RouteGenerics} from "../index";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Hero Feats - Numsgil Co</title>
		</Helmet>
		<p>Hero Feats</p>
	</>;
};

const route: Route<RouteGenerics> = {
	path: "feats",
	element: <Page />,
	meta: {},
};

export default route;
