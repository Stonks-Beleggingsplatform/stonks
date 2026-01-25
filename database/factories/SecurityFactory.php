<?php

namespace Database\Factories;

use App\Models\Concerns\Securityable;
use App\Models\Exchange;
use Illuminate\Database\Eloquent\Factories\Factory;

abstract class SecurityFactory extends Factory
{
    public function configure(): SecurityFactory
    {
        return $this->afterCreating(function (Securityable $securityable) {
            $exchangeId = Exchange::inRandomOrder()->first()?->id ?? Exchange::factory()->create()->id;

            $name = $this->faker->company();
            $ticker = $this->faker->unique()->regexify('[A-Z]{3,5}');

            if ($securityable instanceof \App\Models\Stock && $securityable->company) {
                $name = $securityable->company->name;
            } elseif ($securityable instanceof \App\Models\Crypto) {
                $cryptos = [
                    'BTC' => 'Bitcoin',
                    'ETH' => 'Ethereum',
                    'SOL' => 'Solana',
                    'ADA' => 'Cardano',
                    'XRP' => 'Ripple',
                    'DOT' => 'Polkadot',
                    'DOGE' => 'Dogecoin',
                ];
                $ticker = $this->faker->randomElement(array_keys($cryptos));
                $name = $cryptos[$ticker];
                // Avoid ticker unique constraint issues if running multiple times
                $ticker = $this->faker->unique()->regexify($ticker.'[0-9]?');
            } elseif ($securityable instanceof \App\Models\Bond) {
                $name = $this->faker->country().' '.$this->faker->numberBetween(2025, 2045).' Bond';
                $ticker = strtoupper($this->faker->unique()->lexify('???')).'B';
            }

            $securityable->security()->create([
                'exchange_id' => $exchangeId,
                'name' => $name,
                'ticker' => $ticker,
                'price' => $this->faker->numberBetween(1000, 50000), // Prices in cents (e.g. $10.00 to $500.00)
            ]);
        });
    }
}
