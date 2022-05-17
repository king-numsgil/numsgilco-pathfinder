import {HTMLChakraProps, IconButton, Tooltip} from "@chakra-ui/react";
import {IconType} from "react-icons";
import {FC, useState} from "react";

interface ToggleIconButtonProps {
	"aria-label": string;
	icon: IconType;
	state: boolean;
	onToggle: (newState: boolean) => void;
}

export const ToggleIconButton: FC<ToggleIconButtonProps & HTMLChakraProps<"button">> = props => {
	const [active, setActive] = useState<boolean>(false);
	const {state, onToggle, icon, ...rest} = props;
	const Icon = icon;

	return <Tooltip label={props["aria-label"]}>
		<IconButton
			colorScheme="yellow"
			variant={active ? "solid" : "ghost"}
			icon={<Icon />}
			{...rest}
			onClick={_ => {
				setActive(!active);
				onToggle(active);
			}}
		/>
	</Tooltip>;
};
