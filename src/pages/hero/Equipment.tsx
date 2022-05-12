import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {RouteGenerics} from "../index";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Hero Equipment - Numsgil Co</title>
		</Helmet>
		<p>Hero Equipment</p>
	</>;
};

const route: Route<RouteGenerics> = {
	path: "equipment",
	element: <Page />,
	meta: {},
};

export default route;
