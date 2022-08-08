import {FC, PropsWithChildren} from "react";
import {Flex} from "@chakra-ui/react";

import {SubNavGroup, SubNavButton} from "components/SubNavButton";
import {DiceFormula} from "components/DiceFormula";

export const CombatLayout: FC<PropsWithChildren<{}>> = ({children}) => {
	return <Flex direction="column" alignItems="center">
		<Flex direction="row" justifyContent={{base: "center", md: "space-between"}} flexWrap="wrap" w="100%">
			<SubNavGroup>
				<SubNavButton link={{to: "/combat", activeOptions: {exact: true}}}>Encounter</SubNavButton>
				<SubNavButton link={{to: "/combat/bestiary", activeOptions: {exact: true}}}>Bestiary</SubNavButton>
				<SubNavButton link={{to: "/combat/party", activeOptions: {exact: true}}}>Party</SubNavButton>
			</SubNavGroup>
			<DiceFormula width={{base: "100%", md: "20rem"}} m={2} />
		</Flex>
		{children}
	</Flex>;
}
