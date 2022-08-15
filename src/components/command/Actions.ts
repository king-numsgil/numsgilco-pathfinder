import {Action} from "kbar";
export const Actions: Array<Action> = [
	{
		id: "test1",
		name: "Test 1",
		section: "Experiment",
		perform() {
			alert("Hello World!");
		},
	},
	{
		id: "test2",
		name: "Test 2",
		section: "Experiment",
		perform() {
			alert("Hello World!");
		},
	},
	{
		id: "print",
		name: "Print",
		section: "Utility",
		perform() {
			console.log("Print : Hello World!");
		},
	},
];
