import {Outlet, Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

import {CombatStoreProvicer, useCombatStore} from "./CombatStore";
import {CombatLayout} from "components/combat";
import {pfdb} from "../../data";

const Page: FC = () => {
	const combatStore = useCombatStore();

	return <>
		<Helmet>
			<title>Combat Manager - Numsgil Co</title>
		</Helmet>
		<p>Play // Combat Manager {combatStore.encounterId} {pfdb.isOpen() ? "Opened" : "Closed"}</p>
	</>;
};

const route: Route = {
	path: "combat",
	element: <CombatLayout>
		<CombatStoreProvicer>
			<Outlet />
		</CombatStoreProvicer>
	</CombatLayout>,
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
