import axios from "axios";

export const client = axios.create({
	timeout: 1000,
	baseURL: "/index.php/api",
});
