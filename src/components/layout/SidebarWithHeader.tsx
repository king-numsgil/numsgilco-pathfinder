import {Link as BaseLocationLink, LinkProps, Updater, UseGeneric} from "@tanstack/react-location";
import {FiBell, FiHome, FiMenu} from "react-icons/fi";
import {FC, ReactText, Ref} from "react";
import {IconType} from "react-icons";
import {
	GiBiceps,
	GiBlackBook,
	GiChestArmor,
	GiChoice,
	GiCrystalWand,
	GiDiceTarget,
	GiPerson,
	GiSchoolBag,
} from "react-icons/gi";
import {
	Box,
	BoxProps,
	chakra,
	CloseButton,
	Drawer,
	DrawerContent,
	Flex,
	FlexProps,
	HStack,
	Icon,
	IconButton,
	Text,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";

import {ColorModeToggle} from "./ColorModeButton";
import {RouteGenerics} from "pages";

// from https://chakra-templates.dev/

const LocationLink: FC<LinkProps<RouteGenerics>> = ({children, ...props}) =>
	<BaseLocationLink<RouteGenerics> {...props}>{children}</BaseLocationLink>;

const Link = chakra(LocationLink);

export const SidebarWithHeader: FC = ({children}) => {
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

interface SidebarContentProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent: FC<SidebarContentProps> = ({onClose, ...rest}) => {
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
		<NavItem icon={GiPerson} link={{to: "/hero", activeOptions: {exact: true}}}>Heros</NavItem>

		<Text
			px={4}
			fontSize="md"
			marginTop={3}
			fontWeight={700}
		>
			Hero Editor
		</Text>

		<NavItem icon={GiBiceps} link={{to: "/hero/stats"}}>Stats</NavItem>
		<NavItem icon={GiBlackBook} link={{to: "/hero/background"}}>Background</NavItem>
		<NavItem icon={GiChoice} link={{to: "/hero/classes"}}>Classes</NavItem>
		<NavItem icon={GiDiceTarget} link={{to: "/hero/feats"}}>Feats</NavItem>
		<NavItem icon={GiChestArmor} link={{to: "/hero/equipment"}}>Equipment</NavItem>
		<NavItem icon={GiSchoolBag} link={{to: "/hero/inventory"}}>Inventory</NavItem>
		<NavItem icon={GiCrystalWand} link={{to: "/hero/spells"}}>Spells</NavItem>
	</Box>;
};

interface NavItemProps extends FlexProps {
	icon?: IconType;
	children: ReactText;
	link: {
		// The absolute or relative destination pathname
		to?: string | number | null;
		// The new search object or a function to update it
		search?: true | Updater<UseGeneric<RouteGenerics, "Search">>
		// The new has string or a function to update it
		hash?: Updater<string>;
		// Whether to replace the current history stack instead of pushing a new one
		replace?: boolean;
		// A function that is passed the [Location API](#location-api) and returns additional props for the `active` state of this link. These props override other props passed to the link (`style`'s are merged, `className`'s are concatenated)
		getActiveProps?: () => Record<string, any>;
		// A function that is passed the [Location API](#location-api) and returns additional props for the `inactive` state of this link. These props override other props passed to the link (`style`'s are merged, `className`'s are concatenated)
		getInactiveProps?: () => Record<string, any>;
		// Defaults to `{ exact: false, includeHash: false }`
		activeOptions?: {
			exact?: boolean;
			includeHash?: boolean;
		};
		// If set, will preload the linked route on hover and cache it for this many milliseconds in hopes that the user will eventually navigate there.
		preload?: number;
		// If true, will render the link without the href attribute
		disabled?: boolean;
		// A custom ref prop because of this: https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012
		_ref?: Ref<HTMLAnchorElement>;
	};
}

const NavItem: FC<NavItemProps> = ({icon, children, link, ...rest}) =>
	<Link
		style={{textDecoration: "none"}}
		_focus={{boxShadow: "none"}}
		{...link}
	>
		{({isActive}) => <Flex
			align="center"
			p={4}
			mr={4}
			borderRightRadius="lg"
			role="group"
			cursor="pointer"
			bg={isActive ? "orange.500" : undefined}
			color={isActive ? "white" : undefined}
			_hover={{
				bg: "yellow.500",
				color: "white",
			}}
			{...rest}
		>
			{icon && (
				<Icon
					mr={4}
					fontSize={18}
					_groupHover={{
						color: "white",
					}}
					as={icon}
				/>
			)}
			{children}
		</Flex>}
	</Link>;

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
