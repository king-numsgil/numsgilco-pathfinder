import {Outlet, Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {Flex} from "@chakra-ui/react";
import {FC} from "react";

import {DiceFormulae} from "components/DiceFormulae";
import {RouteGenerics} from "../index";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Combat Tracker - Numsgil Co</title>
		</Helmet>
		<Flex
			direction="column"
		>
			<Flex direction="row">
				<DiceFormulae />
			</Flex>
		</Flex>
	</>;
};

const route: Route<RouteGenerics> = {
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
