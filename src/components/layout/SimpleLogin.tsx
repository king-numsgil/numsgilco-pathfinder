import {SubmitHandler, useForm} from "react-hook-form";
import {useState, VFC} from "react";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Link,
	Stack,
	useColorModeValue,
} from "@chakra-ui/react";

import {ColorModeToggle} from "./ColorModeButton";

export interface LoginData {
	email: string;
	password: string;
}

export interface SimpleLoginProps {
	onSubmit: (data: LoginData) => Promise<void>;
}

export const SimpleLogin: VFC<SimpleLoginProps> = props => {
	const {register, handleSubmit, formState: {errors}} = useForm<LoginData>();
	const [isWorking, setWorking] = useState(false);

	const onSubmit: SubmitHandler<LoginData> = data => {
		setWorking(true);
		props.onSubmit(data).then(() => setWorking(false), () => setWorking(false));
	};

	return <Flex
		direction="column"
		minH="100vh"
		align="center"
		justify="center"
		bg={useColorModeValue("gray.50", "gray.800")}
	>
		<Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
			<Stack align="center">
				<Heading fontSize="4xl">Sign in to your account</Heading>
			</Stack>
			<Box
				as="form"
				rounded="lg"
				bg={useColorModeValue("white", "gray.700")}
				boxShadow="lg"
				p={8}
				onSubmit={handleSubmit(onSubmit)}
			>
				<Stack spacing={4}>
					<FormControl id="email" isInvalid={errors.email != undefined}>
						<FormLabel>Email address</FormLabel>
						<Input
							type="email"
							disabled={isWorking}
							{...register("email", {required: true})}
						/>
						{errors.email && <FormErrorMessage>Email is required</FormErrorMessage>}
					</FormControl>
					<FormControl id="password" isInvalid={errors.password != undefined}>
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							disabled={isWorking}
							{...register("password", {required: true})}
						/>
						{errors.password && <FormErrorMessage>Password is required</FormErrorMessage>}
					</FormControl>
					<Stack spacing={10}>
						<Stack
							direction={{base: "column", sm: "row"}}
							align="start"
							justify="space-between"
						>
							<Link color="blue.400">Forgot password?</Link>
						</Stack>
						<Button
							type="submit"
							bg="blue.400"
							color="white"
							isLoading={isWorking}
							loadingText="Signing in..."
							_hover={{
								bg: "blue.500",
							}}
						>
							Sign in
						</Button>
					</Stack>
				</Stack>
			</Box>
		</Stack>
		<ColorModeToggle my={-7} />
	</Flex>;
};
