import {Route} from "@tanstack/react-location";
import {Helmet} from "react-helmet-async";
import {FC} from "react";

const Page: FC = () => {
	return <>
		<Helmet>
			<title>Home - Numsgil Co</title>
		</Helmet>
		<p>Home</p>
	</>;
};

const route: Route = {
	path: "home",
	element: <Page />,
	meta: {},
};

export default route;
