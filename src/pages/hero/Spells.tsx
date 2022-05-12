import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {RouteGenerics} from "../index";

const Page: FC = () => {
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
