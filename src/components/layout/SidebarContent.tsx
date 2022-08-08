import {Box, BoxProps, CloseButton, Flex, Text, useColorModeValue} from "@chakra-ui/react";
import {FiHome} from "react-icons/fi";
import {FC} from "react";
import {
	GiBiceps,
	GiBlackBook,
	GiChestArmor,
	GiChoice,
	GiCrystalWand,
	GiDiceTarget,
	GiPerson,
	GiSchoolBag,
	GiSwordsEmblem,
} from "react-icons/gi";

import {NavItem} from "./NavItem";

interface SidebarContentProps extends BoxProps {
	onClose: () => void;
}

export const SidebarContent: FC<SidebarContentProps> = ({onClose, ...rest}) => {
	const currentHero = null;
	return <Box
		transition="0.3s ease"
		bg={useColorModeValue("green.400", "green.700")}
		w={{base: "full", md: 60}}
		pos="fixed"
		h="full"
		css={{
			"&::-webkit-scrollbar": {
				display: "none",
			},
		}}
		overflowY="scroll"
		{...rest}
	>
		<Flex h={20} alignItems="center" mx={8} justifyContent="space-between">
			<Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
				Numsgil Co
			</Text>
			<CloseButton display={{base: "flex", md: "none"}} onClick={onClose} />
		</Flex>
		<NavItem icon={FiHome} link={{to: "/home"}}>Home</NavItem>
		<NavItem icon={GiSwordsEmblem} link={{to: "/combat", activeOptions: {exact: true}}}>Combat Tracker</NavItem>
		<NavItem icon={GiPerson} link={{to: "/hero", activeOptions: {exact: true}}}>Heroes</NavItem>
	</Box>;
};
