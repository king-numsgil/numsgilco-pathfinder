import {Button, Input, InputGroup, InputRightElement, useToast} from "@chakra-ui/react";
import {Dice} from "dice-typescript";
import {FC, useState} from "react";

export const DiceFormulae: FC = () => {
	const toast = useToast();
	const [formulae, setFormulae] = useState<string>("");
	const dice = new Dice();

	const handleRoll = () => {
		const result = dice.roll(formulae);
		if (result.errors.length === 0) {
			toast({
				title: "Dice Roll",
				description: `${formulae} = ${result.total}`,
				status: "success",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
		} else {
			toast({
				title: "Dice Roll Errors",
				description: result.errors.join("\n"),
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	return <InputGroup size="md">
		<Input
			pr="4.5rem"
			type="text"
			placeholder="Dice formulae"
			value={formulae}
			onChange={event => setFormulae(event.target.value)}
		/>
		<InputRightElement width="4.5rem">
			<Button h="1.75rem" size="sm" onClick={handleRoll}>
				Roll
			</Button>
		</InputRightElement>
	</InputGroup>;
};
