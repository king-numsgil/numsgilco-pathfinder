import {PropsWithChildren, useCallback, useState} from "react";
import {useLiveQuery} from "dexie-react-hooks";
import {state} from "@bit-about/state";

import {Party, pfdb} from "data";

interface CombatStore {
	partyId: number;
	party: Party | undefined;

	loadParty(id: number): void;
}

export const [CombatStoreProvider, useCombatStore] = state<PropsWithChildren<{}>, CombatStore>((): CombatStore => {
	const [partyId, setPartyId] = useState<number>(parseInt(localStorage.getItem("partyId") ?? "0"));
	const party = useLiveQuery<Party>(async () => await pfdb.party.get(partyId) as Party, [partyId]);

	const loadParty = useCallback((id: number): void => {
		setPartyId(id);
		localStorage.setItem("partyId", id.toString());
	}, [setPartyId]);

	return {
		party,
		partyId,
		loadParty,
	}
});
