import {Outlet, Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {RouteGenerics} from "../index";
import Background from "./Background";
import Classes from "./Classes";
import Equipment from "./Equipment";
import Feats from "./Feats";
import Inventory from "./Inventory";
import Spells from "./Spells";
import Stats from "./Stats";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Hero Editor - Numsgil Co</title>
		</Helmet>
		<p>Hero Editor</p>
	</>;
};

const route: Route<RouteGenerics> = {
	path: "hero",
	element: <Outlet />,
	children: [
		{
			path: "/",
			element: <Page />,
		},
		Background,
		Classes,
		Equipment,
		Feats,
		Inventory,
		Spells,
		Stats,
	],
	meta: {},
};

export default route;
