<?php

namespace App\Services\SecurityData\Adapters;

use App\DTO\CompanyDTO;
use App\DTO\HistoricalPriceDTO;
use App\DTO\Securityable\StockDTO;
use App\DTO\SecurityDTO;
use App\Enums\Sector;
use App\Models\Security;
use App\Services\SecurityData\SecurityDataAdapter;
use Exception;
use Illuminate\Support\Facades\Http;

class AlphaVantageAdapter implements SecurityDataAdapter
{
    private string $apiKey;
    private string $baseUrl = 'https://www.alphavantage.co/query';

    public function __construct()
    {
        $this->apiKey = config('app.alphavantage_api.key');
    }

    public function getPrice(string $ticker): ?float
    {
        $ticker = rawurlencode($ticker);

        $endpoint = "{$this->baseUrl}?function=GLOBAL_QUOTE&symbol={$ticker}&apikey={$this->apiKey}";

        $data = Http::get($endpoint)->json();

        if (empty($data) || isset($data['Information'])) {
            throw new Exception("No data found for ticker: {$ticker}. Message: " . ($data['Information'] ?? 'Unknown error'));
        }

        return $data['Global Quote']['05. price'];
    }

    public function getSecurityDetails(string $ticker): ?StockDTO
    {
        $ticker = rawurlencode($ticker);

        $endpoint = "{$this->baseUrl}?function=OVERVIEW&symbol={$ticker}&apikey={$this->apiKey}";

        $data = Http::get($endpoint)->json();

        if (empty($data) || isset($data['Information'])) {
            throw new Exception("No data found for ticker: {$ticker}. Message: " . ($data['Information'] ?? 'Unknown error'));
        }

        //AlphaVantage does not provide bond or crypto data, so we only handle stocks here
        return StockDTO::fromArray([
            'ticker' => $data['Symbol'] ?? null,
            'name' => $data['Name'] ?? null,
            'price' => $this->getPrice($ticker),
            'pe_ratio' => $data['PERatio'] ?? null,
            'dividend_yield' => $data['DividendYield'] == 'None' ? 0.0 : $data['DividendYield'] ?? null,
            'company' => CompanyDTO::fromArray([
                'name' => $data['Name'] ?? null,
                'sectors' => ($sectorEnum = Sector::tryFrom($data['Sector'] ?? '')) ? [$sectorEnum] : [],
                'employee_count' => 0, // AlphaVantage does not provide employee count
                'market_cap' => $data['MarketCapitalization'] ?? null,
                'email' => '', // AlphaVantage does not provide email
                'phone' => '', // AlphaVantage does not provide phone
                'street' => '', // AlphaVantage does not provide street
                'zip_code' => '', // AlphaVantage does not provide zip code
                'city' => '', // AlphaVantage does not provide city
                'country' => '', // AlphaVantage does not provide country
                'about' => $data['Description'] ?? null,
            ]),
        ]);
    }

    public function search(string $term): array
    {
        $term = rawurlencode($term);

        $endpoint = "{$this->baseUrl}?function=SYMBOL_SEARCH&keywords={$term}&apikey={$this->apiKey}";

        $data = Http::get($endpoint)->json();

        if (empty($data) || isset($data['Information'])) {
            throw new Exception("No data found for search term: {$term}. Message: " . ($data['Information'] ?? 'Unknown error'));
        }

        return collect($data['bestMatches'] ?? [])
            ->map(function ($security) {
                return SecurityDTO::fromArray([
                    'ticker' => $security['1. symbol'] ?? null,
                    'name' => $security['2. name'] ?? null,
                    'price' => 0, //Price is not relevant in search results and would require an additional API call
                ]);
            })
            ->toArray();
    }

    public function getHistoricalData(Security $security): array
    {
        $exchangeCode = $security->exchange ? $security->exchange->code : null;
        $symbol = $security->ticker . ($exchangeCode ? '.' . $exchangeCode : '');
        $endpoint = "{$this->baseUrl}?function=TIME_SERIES_DAILY&symbol={$symbol}&outputsize=compact&apikey={$this->apiKey}";

        $data = Http::get($endpoint)->json();

        if (empty($data) || isset($data['Information'])) {
            throw new Exception("No data found for ticker: {$security->ticker}. Message: " . ($data['Information'] ?? 'Unknown error'));
        }

        $timeSeries = $data['Time Series (Daily)'] ?? [];

        return collect($timeSeries)
            ->map(function ($dayData, $date) {
                HistoricalPriceDTO::fromArray([
                    'date' => $date,
                    'open' => $dayData['1. open'] ?? null,
                    'high' => $dayData['2. high'] ?? null,
                    'low' => $dayData['3. low'] ?? null,
                    'close' => $dayData['4. close'] ?? null,
                    'volume' => $dayData['5. volume'] ?? null,
                ]);
            })
            ->values()
            ->toArray();
    }
}
