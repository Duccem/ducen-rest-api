export interface CrudEntity {
	list(options?: any): Promise<any>;
	get(id: string | number, options?: any): Promise<any>;
	insert(data: any): Promise<any>;
	update(id: string | number, options?: any): Promise<any>;
	remove(id: string | number): Promise<any>;
}

export interface AuthEntity {
	login(identifier: string, password: string): Promise<any>;
	signup(actor: any): Promise<any>;
}

export interface DoubleEntity {
	addDetail(id: number | string, detailId: number | string, data?: any): Promise<any>;
	removeDetail(id: number | string, detailId: number | string, data?: any): Promise<any>;
}
