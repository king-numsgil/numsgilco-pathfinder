import {Outlet, Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Hero Editor - Numsgil Co</title>
		</Helmet>
		<p>Hero Editor</p>
	</>;
};

const route: Route = {
	path: "hero",
	element: <Outlet />,
	children: [
		{
			path: "/",
			element: <Page />,
		},
		{
			path: "background",
			element: () => import("./BackgroundPage").then(mod => <mod.BackgroundPage />),
			meta: {},
		},
		{
			path: "classes",
			element: () => import("./ClassesPage").then(mod => <mod.ClassesPage />),
			meta: {},
		},
		{
			path: "equipment",
			element: () => import("./EquipmentPage").then(mod => <mod.EquipmentPage />),
			meta: {},
		},
		{
			path: "feats",
			element: () => import("./FeatsPage").then(mod => <mod.FeatsPage />),
			meta: {},
		},
		{
			path: "inventory",
			element: () => import("./InventoryPage").then(mod => <mod.InventoryPage />),
			meta: {},
		},
		{
			path: "spells",
			element: () => import("./SpellsPage").then(mod => <mod.SpellsPage />),
			meta: {},
		},
		{
			path: "stats",
			element: () => import("./StatsPage").then(mod => <mod.StatsPage />),
			meta: {},
		},
	],
	meta: {},
};

export default route;
