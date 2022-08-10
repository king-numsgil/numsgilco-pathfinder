import {Outlet, Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {CombatLayout} from "components/combat";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Combat Manager - Numsgil Co</title>
		</Helmet>
		<p>Play // Combat Manager</p>
	</>;
};

const route: Route = {
	path: "combat",
	element: <CombatLayout><Outlet /></CombatLayout>,
	children: [
		{
			path: "/",
			element: <Page />,
		},
		{
			path: "bestiary",
			element: () => import("./BestiaryPage").then(mod => <mod.BestiaryPage />),
		},
		{
			path: "party",
			element: () => import("./PartyPage").then(mod => <mod.PartyPage />),
		},
	],
	meta: {},
};

export default route;
