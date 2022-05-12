import {Outlet, Route} from "@tanstack/react-location";
import {useLiveQuery} from "dexie-react-hooks";
import {Helmet} from "react-helmet-async";
import {FC} from "react";
import {
	Button,
	ButtonGroup,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	UseModalProps
} from "@chakra-ui/react";

import {DiceFormula} from "components/DiceFormula";
import {RouteGenerics} from "../index";
import {pfdb} from "data";

const CombatantsModal: FC<UseModalProps> = props => {
	const combatants = useLiveQuery(() => pfdb.combatants.toArray());

	return <Modal size="lg" autoFocus={false} {...props}>
		<ModalOverlay />
		<ModalContent>
			<ModalHeader>Combatants</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				<p>Hello!</p>
			</ModalBody>
			<ModalFooter>
				<Button colorScheme="blue" mr={3} onClick={props.onClose}>
					Close
				</Button>
				<Button variant="ghost">
					Create Combatant
				</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>;
};

const Page: FC = () => {
	const combatantsDisclose = useDisclosure();

	return <>
		<Helmet>
			<title>Combat Tracker - Numsgil Co</title>
		</Helmet>
		<Flex direction="column">
			<Flex direction="row" justifyContent={{base: "center", md: "flex-end"}} flexWrap="wrap">
				<DiceFormula width={{base: "100%", md: "20rem"}} m={2} />
				<ButtonGroup size="md" variant="solid" isAttached m={2}>
					<Button onClick={combatantsDisclose.onOpen}>
						Combatants
					</Button>
					<Button>
						Encounters
					</Button>
				</ButtonGroup>
			</Flex>
		</Flex>
		<CombatantsModal isOpen={combatantsDisclose.isOpen} onClose={combatantsDisclose.onClose} />
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
