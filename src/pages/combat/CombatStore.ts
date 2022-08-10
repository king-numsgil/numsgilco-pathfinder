import {useCallback, useState, PropsWithChildren} from "react";
import {state} from "@bit-about/state";

interface CombatStore {
	encounterId: number;
	partyId: number;

	loadEncounter(id: number): Promise<void>;

	loadParty(id: number): Promise<void>;
}

export const [CombatStoreProvicer, useCombatStore] = state<PropsWithChildren<{}>, CombatStore>((): CombatStore => {
	const [encounterId, setEncounterId] = useState<number>(parseInt(localStorage.getItem("encounterId") ?? "0"));
	const [partyId, setPartyId] = useState<number>(parseInt(localStorage.getItem("partyId") ?? "0"));

	const loadEncounter = useCallback(async (id: number): Promise<void> => {
		setEncounterId(id);
		localStorage.setItem("encounterId", id.toString());
	}, [setEncounterId]);

	const loadParty = useCallback(async (id: number): Promise<void> => {
		setPartyId(id);
		localStorage.setItem("partyId", id.toString());
	}, [setPartyId]);

	return {
		encounterId,
		partyId,
		loadEncounter,
		loadParty,
	}
});
