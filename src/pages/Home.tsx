import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {RouteGenerics} from "./index";

const Page: FC = () => {
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
	meta: {},
};

export default route;
