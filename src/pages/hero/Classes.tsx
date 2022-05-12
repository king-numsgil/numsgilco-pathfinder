import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {RouteGenerics} from "../index";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Hero Classes - Numsgil Co</title>
		</Helmet>
		<p>Hero Classes</p>
	</>;
};

const route: Route<RouteGenerics> = {
	path: "classes",
	element: <Page />,
	meta: {},
};

export default route;
