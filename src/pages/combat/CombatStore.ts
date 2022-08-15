import {useCallback, useState, PropsWithChildren} from "react";
import {state} from "@bit-about/state";

interface CombatStore {
	partyId: number;

	loadParty(id: number): Promise<void>;
}

export const [CombatStoreProvider, useCombatStore] = state<PropsWithChildren<{}>, CombatStore>((): CombatStore => {
	const [partyId, setPartyId] = useState<number>(parseInt(localStorage.getItem("partyId") ?? "0"));

	const loadParty = useCallback(async (id: number): Promise<void> => {
		setPartyId(id);
		localStorage.setItem("partyId", id.toString());
	}, [setPartyId]);

	return {
		partyId,
		loadParty,
	}
});
