// Earliest date the app supports transactions for. Mirrors the backend
// config/rates.php → rates.earliest_date (the exchange-rate history floor).
// Expenses before this cannot be converted, so they are blocked end to end.
export const EARLIEST_TRANSACTION_DATE = new Date(2026, 0, 1);
