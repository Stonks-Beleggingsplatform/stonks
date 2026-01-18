<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\Exchange;
use App\Models\Stock;
use App\Models\Bond;
use App\Models\Crypto;
use Illuminate\Database\Seeder;

class StandardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed Currencies
        $usd = Currency::firstOrCreate(['name' => 'USD']);
        $eur = Currency::firstOrCreate(['name' => 'EUR']);
        $gbp = Currency::firstOrCreate(['name' => 'GBP']);

        // Seed Exchanges
        Exchange::firstOrCreate(['name' => 'NASDAQ'], ['code' => 'NSDQ', 'currency_id' => $usd->id]);
        Exchange::firstOrCreate(['name' => 'NYSE'], ['code' => 'NYSE', 'currency_id' => $usd->id]);
        Exchange::firstOrCreate(['name' => 'LSE'], ['code' => 'LSE', 'currency_id' => $gbp->id]);
        Exchange::firstOrCreate(['name' => 'Euronext'], ['code' => 'EURX', 'currency_id' => $eur->id]);

        // Seed Securities
        Stock::factory()->count(10)->create();
        Bond::factory()->count(5)->create();
        Crypto::factory()->count(5)->create();
    }
}
