import {KBarAnimator, KBarPortal, KBarPositioner, KBarResults, KBarSearch, useMatches} from "kbar";
import {chakra, Text, useColorModeValue} from "@chakra-ui/react";
import {FC} from "react";

import {useNavActions, useThemeActions} from "./Actions";

const ChakraBarPositioner = chakra(KBarPositioner);
const ChakraBarAnimator = chakra(KBarAnimator);
const ChakraBarSearch = chakra(KBarSearch);

const RenderResults: FC = () => {
	const {results} = useMatches();

	return <KBarResults
		items={results}
		onRender={({item, active}) =>
			typeof item === "string" ? <Text
				p="8px 16px"
				fontSize="10px"
				textTransform="uppercase"
				opacity={active ? 1 : 0.75}
				background={active ? useColorModeValue("gray.400", "gray.500") : "inherit"}
				decoration="underline"
			>
				{item}
			</Text> : <Text
				p="8px 16px"
				fontSize="10px"
				textTransform="uppercase"
				opacity={active ? 1 : 0.75}
				background={active ? useColorModeValue("gray.400", "gray.500") : "inherit"}
				cursor="pointer"
			>
				{item.name}
			</Text>
		}
	/>;
}

export const Menu: FC = () => {
	useNavActions();
	useThemeActions();

	return <KBarPortal>
		<ChakraBarPositioner>
			<ChakraBarAnimator
				maxW={600}
				w="100%"
				background={useColorModeValue("gray.300", "gray.600")}
				color={useColorModeValue("gray.900", "gray.200")}
				borderRadius={4}
				overflow="hidden"
				boxShadow={useColorModeValue("0px 6px 20px rgb(0 0 0 / 20%)", "rgb(0 0 0 / 50%) 0px 16px 70px")}
			>
				<ChakraBarSearch
					p="12px 16px"
					fontSize="16px"
					w="100%"
					boxSizing="border-box"
					outline="none"
					border="none"
					background={useColorModeValue("gray.300", "gray.600")}
					color={useColorModeValue("gray.900", "gray.200")}
				/>
				<RenderResults />
			</ChakraBarAnimator>
		</ChakraBarPositioner>
	</KBarPortal>;
};
