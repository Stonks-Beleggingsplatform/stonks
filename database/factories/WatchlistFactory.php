<?php

namespace Database\Factories;

use App\Models\Bond;
use App\Models\Stock;
use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Database\Eloquent\Factories\Factory;

class WatchlistFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->words(3, true),
        ];
    }

    public function configure(): WatchlistFactory
    {
        return $this->afterCreating(function (Watchlist $watchlist) {
            $stocksCount = $this->faker->numberBetween(3, 10);
            $bondsCount = $this->faker->numberBetween(1, 5);

            $stocks = collect(Stock::factory($stocksCount)->create())->map(function ($stock) {
                return $stock->security;
            });

            $bonds = collect(Bond::factory($bondsCount)->create())->map(function ($bond) {
                return $bond->security;
            });

            $securities = $stocks->merge($bonds);

            $watchlist->securities()->attach($securities->pluck('id')->toArray());
        });
    }
}
