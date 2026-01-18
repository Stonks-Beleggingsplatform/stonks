declare namespace App.DTO {
export type CompanyDTO = {
name: string;
sectors: Array<any>;
employee_count: number;
market_cap: number;
email: string;
phone: string;
street: string;
zip_code: string;
city: string;
country: string;
about: string;
};
export type HoldingDTO = {
id: number;
ticker: string;
quantity: number;
purchase_price: number;
avg_price: number;
gain_loss: number;
};
export type PortfolioDTO = {
id: number;
cash: number;
total_value: number;
total_return: number;
holdings: Array<any>;
};
export type SecurityDTO = (StockDTO & { dto_type: 'stock' }) | (BondDTO & { dto_type: 'bond' }) | (CryptoDTO & { dto_type: 'crypto' });
export type UserDTO = {
id: number;
name: string;
email: string;
};
export type WatchlistDTO = {
id: number;
name: string;
user: App.DTO.UserDTO;
securities: Array<any> | null;
securities_count: number;
};
}
declare namespace App.DTO.Securityable {
export type BondDTO = {
dto_type: string;
nominal_value: number;
coupon_rate: number;
maturity_date: string;
ticker: string;
name: string;
price: number;
};
export type CryptoDTO = {
dto_type: string;
type: App.Enums.CryptoType;
ticker: string;
name: string;
price: number;
};
export type StockDTO = {
dto_type: string;
pe_ratio: number;
dividend_yield: number;
company: App.DTO.CompanyDTO;
ticker: string;
name: string;
price: number;
};
}
declare namespace App.Enums {
export type CryptoType = 'coin' | 'stablecoin' | 'token' | 'nft' | 'other';
export type OrderAction = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'completed' | 'canceled';
export type OrderType = 'market' | 'limit';
export type Sector = 'technology' | 'finance' | 'healthcare' | 'retail' | 'manufacturing' | 'energy' | 'transportation' | 'real_estate';
export type TransactionType = 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'dividend';
export type UserRole = 'admin' | 'user';
}
