import { JsonDocument } from '../../../../shared/domain/Types/JsonDocument';

export type CompanyJsonDocument = JsonDocument & {
	business_name: string;
	rif: string;
	address: string;
	routes: Array<string>;
	daily_profit: number;
	daily_spend: number;
};
