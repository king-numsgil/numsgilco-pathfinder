import {DefaultGenerics, Link as BaseLocationLink, LinkProps, Updater, UseGeneric} from "@tanstack/react-location";
import {chakra, Flex, FlexProps, useColorModeValue} from "@chakra-ui/react";
import {FC, PropsWithChildren, Ref} from "react";

const LocationLink: FC<LinkProps> = ({children, ...props}) =>
	<BaseLocationLink {...props}>{children}</BaseLocationLink>;

const Link = chakra(LocationLink);

interface SubNavButtonProps {
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

export const SubNavButton: FC<SubNavButtonProps> = ({children, link}) =>
	<Link
		p={2}
		borderRadius={5}
		background={useColorModeValue("gray.100", "whiteAlpha.200")}
		transition="all 200ms"
		_hover={{
			color: useColorModeValue("black", "inherit"),
			background: useColorModeValue("gray.200", "whiteAlpha.300"),
		}}
		getActiveProps={() => ({
			style: {
				background: "var(--chakra-colors-orange-500)",
				color: "white",
			},
		})}
		{...link}
	>
		{children}
	</Link>;

export const SubNavGroup: FC<PropsWithChildren<FlexProps>> = ({children, ...rest}) =>
	<Flex
		direction="row"
		alignItems="center"
		gap={1}
		{...rest}
	>
		{children}
	</Flex>;
