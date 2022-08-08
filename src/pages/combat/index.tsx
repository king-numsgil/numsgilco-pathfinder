import {Outlet, Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Combat Manager - Numsgil Co</title>
		</Helmet>
		<p>Combat Manager</p>
	</>;
};

const route: Route = {
	path: "combat",
	element: <Outlet />,
	children: [
		{
			path: "/",
			element: <Page />,
		},
	],
	meta: {},
};

export default route;
