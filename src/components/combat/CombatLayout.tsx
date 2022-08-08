import {Button, ButtonGroup, Flex} from "@chakra-ui/react";
import {FC, PropsWithChildren} from "react";

import {DiceFormula} from "components/DiceFormula";

export const CombatLayout: FC<PropsWithChildren<{}>> = ({children}) => {
	return <Flex direction="column" alignItems="center">
		<Flex direction="row" justifyContent={{base: "center", md: "space-between"}} flexWrap="wrap" w="100%">
			<ButtonGroup size="md" variant="solid" isAttached m={2}>
				<ButtonGroup size="md" variant="solid" isAttached m={2}>
					<Button>Encounter</Button>
					<Button>Bestiary</Button>
					<Button>Party</Button>
				</ButtonGroup>
			</ButtonGroup>
			<DiceFormula width={{base: "100%", md: "20rem"}} m={2} />
		</Flex>
		{children}
	</Flex>;
}
