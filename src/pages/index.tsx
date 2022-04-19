import {MakeGenerics, Navigate, Outlet, Route, useRouter} from "@tanstack/react-location";
import {IconType} from "react-icons";
import {FC} from "react";

import {SidebarWithHeader} from "components/layout";
import Home from "./Home";

export type RouteGenerics = MakeGenerics<{
	RouteMeta: {
		name: string;
		icon: IconType;
	}
}>;

const RootLayout: FC = ({children}) => {
	const router = useRouter<RouteGenerics>();
	if (router.state.location.pathname === "/") {
		return <Navigate<RouteGenerics> to="/home" replace />;
	}

	return <SidebarWithHeader>
		{children}
	</SidebarWithHeader>;
};

export const routes: Array<Route<RouteGenerics>> = [
	{
		path: "/",
		element: <RootLayout><Outlet /></RootLayout>,
		children: [
			Home,
		],
	},
];
