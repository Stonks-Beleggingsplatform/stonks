<?php

namespace App\Services\Forex\Adapters;

use App\Models\Currency;
use App\Services\Forex\ForexDataAdapter;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ForexAdapter implements ForexDataAdapter
{
    private ?string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('app.FOREX_API_KEY.key');
    }

    public function getExchangeRate(Currency $sourceCurrency, Currency $targetCurrency): ?float
    {
        if ($sourceCurrency->id === $targetCurrency->id) {
            return 1.0;
        }

        if (empty($this->apiKey)) {
            Log::error('Fixer API Key is not set for ForexAdapter.');

            return null;
        }

        $url = "https://api.apilayer.com/fixer/latest?symbols={$targetCurrency->name}&base={$sourceCurrency->name}";

        try {
            $response = Http::withHeaders([
                'apikey' => $this->apiKey,
            ])->get($url);

            if ($response->successful()) {
                $data = $response->json();

                if (isset($data['rates'][$targetCurrency->name])) {
                    return (float) $data['rates'][$targetCurrency->name];
                } else {
                    Log::warning("Fixer API: Rate for {$sourceCurrency->name} to {$targetCurrency->name} not found in response.", ['response' => $data]);

                    return null;
                }
            } else {
                Log::error("Fixer API Request Failed: {$response->status()}", ['response' => $response->body()]);

                return null;
            }
        } catch (\Throwable $e) {
            Log::error("Fixer API Exception: {$e->getMessage()}", ['exception' => $e]);

            return null;
        }
    }
}
