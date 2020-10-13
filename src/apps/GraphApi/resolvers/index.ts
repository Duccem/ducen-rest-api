export default {
	Query: {
		users: () => [],
		signin: (_parent: any, _args: any, _context: any, _info: any) => {
			return {
				toke: 'dgfdf',
				user: null,
			};
		},
	},
};
