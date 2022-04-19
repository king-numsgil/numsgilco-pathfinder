import {ButtonProps, IconButton, useColorMode} from '@chakra-ui/react';
import {BsMoonStarsFill, BsSun} from 'react-icons/bs';
import {FC} from "react";

export const ColorModeToggle: FC<ButtonProps> = props => {
	const {colorMode, toggleColorMode} = useColorMode();
	return <IconButton
		aria-label="Toggle Color Mode"
		onClick={toggleColorMode}
		size="lg"
		variant="ghost"
		icon={colorMode === 'light' ? <BsMoonStarsFill /> : <BsSun />}
		{...props}
	/>;
};
