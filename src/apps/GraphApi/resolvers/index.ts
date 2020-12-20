import { BadRequest } from "../../../contexts/shared/domain/Errors";

export default {
	Query: {
		users: () => [],
		signin: (_parent: any, _args: any, _context: any, _info: any) => {
			throw new BadRequest("Mala peticion")
			return {
				token: 'dgfdf',
				user: null,
			};
		},
	},
};
