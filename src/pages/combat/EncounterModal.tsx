import {useLiveQuery} from "dexie-react-hooks";
import {FaTrash} from "react-icons/all";
import {FC} from "react";
import {
	Button,
	ButtonGroup,
	Editable,
	EditableInput,
	EditablePreview,
	Flex,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	UseModalProps
} from "@chakra-ui/react";

import {Encounter, pfdb} from "data";

interface EncounterModalProps {
	selectEncounter: (id: number) => void;
}

export const EncounterModal: FC<EncounterModalProps & UseModalProps> = ({selectEncounter, ...props}) => {
	const encounters = useLiveQuery(() =>
		pfdb.encounters.toArray().then(value => value
			.map(value => value as Encounter)
			.sort((a, b) => a.name.localeCompare(b.name))
		)
	);

	return <Modal size="lg" autoFocus={false} {...props}>
		<ModalOverlay />
		<ModalContent>
			<ModalHeader>Encounters</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
				{encounters?.map(value => <Flex
					direction="row"
					justifyContent="space-between"
					mt={1}
					key={value.id}
				>
					<Editable defaultValue={value.name} onSubmit={name => {
						if (value.id) {
							pfdb.encounters.update(value.id, {name});
						}
					}}>
						<EditablePreview />
						<EditableInput />
					</Editable>
					<ButtonGroup isAttached size="sm" variant="outline">
						<IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => {
							if (value.id) {
								pfdb.encounters.delete(value.id).catch(console.error);
							}
						}} />
						<Button size="sm" variant="outline" onClick={() => selectEncounter(value.id ?? 0)}>
							Load
						</Button>
					</ButtonGroup>
				</Flex>)}
			</ModalBody>
			<ModalFooter>
				<Button colorScheme="blue" mr={3} onClick={props.onClose}>
					Close
				</Button>
				<Button variant="ghost" onClick={() => pfdb.encounters.add({name: "New Encounter", participants: []})}>
					Create Encounter
				</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>;
}
