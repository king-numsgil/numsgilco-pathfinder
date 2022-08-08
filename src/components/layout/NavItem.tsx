import {DefaultGenerics, Link as BaseLocationLink, LinkProps, Updater, UseGeneric} from "@tanstack/react-location";
import {chakra, Flex, FlexProps, Icon} from "@chakra-ui/react";
import {IconType} from "react-icons";
import {FC, Ref} from "react";

const LocationLink: FC<LinkProps> = ({children, ...props}) =>
	<BaseLocationLink {...props}>{children}</BaseLocationLink>;

const Link = chakra(LocationLink);

interface NavItemProps extends FlexProps {
	icon?: IconType;
	children: string;
	link: {
		// The absolute or relative destination pathname
		to?: string | number | null;
		// The new search object or a function to update it
		search?: true | Updater<UseGeneric<DefaultGenerics, "Search">>
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

export const NavItem: FC<NavItemProps> = ({icon, children, link, ...rest}) =>
	<Link
		style={{textDecoration: "none"}}
		_focusVisible={{boxShadow: "none"}}
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
