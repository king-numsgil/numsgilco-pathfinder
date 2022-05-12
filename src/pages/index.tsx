import {MakeGenerics, Navigate, Outlet, Route, useRouter} from "@tanstack/react-location";
import {FC, PropsWithChildren} from "react";

import {SidebarWithHeader} from "components/layout";
import Combat from "./combat";
import Home from "./Home";
import Hero from "./hero";

export type RouteGenerics = MakeGenerics<{
	RouteMeta: {}
}>;

const RootLayout: FC<PropsWithChildren<{}>> = ({children}) => {
	const router = useRouter<RouteGenerics>();
	if (router.state.location.pathname === "/") {
		return <Navigate<RouteGenerics> to="/home" replace />;
	}

	return <SidebarWithHeader>{children}</SidebarWithHeader>;
};

export const routes: Array<Route<RouteGenerics>> = [
	{
		path: "/",
		element: <RootLayout><Outlet /></RootLayout>,
		children: [
			Combat,
			Home,
			Hero,
		],
	},
];
