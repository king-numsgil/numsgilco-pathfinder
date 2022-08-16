import {useNavigate} from "@tanstack/react-location";
import {Action, useRegisterActions} from "kbar";
import {useColorMode} from "@chakra-ui/react";

import {pfdb} from "data";

export const Actions: Array<Action> = [
	{
		id: "dbclear",
		name: "Clear IDB",
		section: "Utilities",
		priority: -10,
	},
	{
		id: "dbclearYes",
		name: "Are you sure?",
		section: "",
		parent: "dbclear",
		perform() {
			pfdb
				.open()
				.then(db => db.delete())
				.then(() => pfdb.open())
				.then(db => db.isOpen() ? alert("IDB Cleared and reopened") : alert("Something's wrong..."))
				.catch(console.error);
		},
	}
];

export function useThemeActions() {
	const {setColorMode} = useColorMode();
	useRegisterActions([
		{
			id: "theme",
			name: "Select Theme...",
			section: "Utilities",
			priority: 0,
		},
		{
			id: "themeLight",
			name: "Light",
			parent: "theme",
			section: "",
			perform() {
				setColorMode("light");
			},
		},
		{
			id: "themeDark",
			name: "Dark",
			parent: "theme",
			section: "",
			perform() {
				setColorMode("dark");
			},
		},
	], [setColorMode]);
}

export function useNavActions() {
	const navigate = useNavigate();
	useRegisterActions([
		{
			id: "navHome",
			name: "Home",
			section: "Navigation",
			priority: 1,
			perform() {
				navigate({
					to: "/home",
				});
			},
		},
		{
			id: "navCombat",
			name: "Combat Manager",
			section: "Navigation",
			priority: 1,
		},
		{
			id: "navCombatPlay",
			name: "Play",
			section: "",
			parent: "navCombat",
			perform() {
				navigate({
					to: "/combat",
				});
			},
		},
		{
			id: "navCombatBestiary",
			name: "Bestiary",
			section: "",
			parent: "navCombat",
			perform() {
				navigate({
					to: "/combat/bestiary",
				});
			},
		},
		{
			id: "navCombatParty",
			name: "Party",
			section: "",
			parent: "navCombat",
			perform() {
				navigate({
					to: "/combat/party",
				});
			},
		},
	], [navigate]);
}
