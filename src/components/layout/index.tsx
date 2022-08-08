import {FiBell, FiMenu} from "react-icons/fi";
import {FC, PropsWithChildren} from "react";
import {
	Box,
	Drawer,
	DrawerContent,
	Flex,
	FlexProps,
	HStack,
	IconButton,
	Text,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";

import {ColorModeToggle} from "./ColorModeButton";
import {SidebarContent} from "./SidebarContent";

// from https://chakra-templates.dev/

export const SidebarWithHeader: FC<PropsWithChildren<{}>> = ({children}) => {
	const {isOpen, onOpen, onClose} = useDisclosure();
	return <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
		<SidebarContent
			onClose={onClose}
			display={{base: "none", md: "block"}}
		/>
		<Drawer
			autoFocus={false}
			isOpen={isOpen}
			placement="left"
			onClose={onClose}
			returnFocusOnClose={false}
			onOverlayClick={onClose}
			blockScrollOnMount
			size="full"
		>
			<DrawerContent>
				<SidebarContent onClose={onClose} />
			</DrawerContent>
		</Drawer>
		<MobileNav onOpen={onOpen} />
		<Box
			transition="0.3s ease"
			ml={{base: 0, md: 60}}
			bg={useColorModeValue("green.400", "green.700")}
		>
			<Box
				p={4}
				bg={useColorModeValue("gray.100", "gray.900")}
				borderTopLeftRadius={{base: 0, md: 40}}
			>
				{children}
			</Box>
		</Box>
	</Box>;
};

interface MobileProps extends FlexProps {
	onOpen: () => void;
}

const MobileNav: FC<MobileProps> = ({onOpen, ...rest}) => {
	return <Flex
		ml={{base: 0, md: 60}}
		px={{base: 4, md: 4}}
		height={20}
		alignItems="center"
		bg={useColorModeValue("green.400", "green.700")}
		justifyContent={{base: "space-between", md: "flex-end"}}
		transition="0.3s ease"
		{...rest}
	>
		<IconButton
			display={{base: "flex", md: "none"}}
			onClick={onOpen}
			variant="outline"
			aria-label="open menu"
			icon={<FiMenu />}
		/>

		<Text
			display={{base: "flex", md: "none"}}
			fontSize="2xl"
			fontFamily="monospace"
			fontWeight="bold"
		>
			Numsgil Co
		</Text>

		<HStack spacing={{base: 0, md: 6}}>
			<ColorModeToggle />
			<IconButton
				size="lg"
				variant="ghost"
				aria-label="open menu"
				icon={<FiBell />}
			/>
		</HStack>
	</Flex>;
};
