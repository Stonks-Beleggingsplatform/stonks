declare namespace App.DTO {
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
}
declare namespace App.Enums {
export type OrderAction = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'completed' | 'canceled';
export type OrderType = 'market' | 'limit';
export type TransactionType = 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'dividend';
}
