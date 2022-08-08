import {Navigate, Outlet, Route, useRouter} from "@tanstack/react-location";
import {FC, PropsWithChildren} from "react";

import {SidebarWithHeader} from "components/layout";
import Combat from "./combat";
import Home from "./Home";
import Hero from "./hero";

const RootLayout: FC<PropsWithChildren<{}>> = ({children}) => {
	const router = useRouter();
	if (router.state.location.pathname === "/") {
		return <Navigate to="/home" replace />;
	}

	return <SidebarWithHeader>{children}</SidebarWithHeader>;
};

export const routes: Array<Route> = [
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
