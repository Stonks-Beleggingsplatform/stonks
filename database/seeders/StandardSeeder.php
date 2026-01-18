<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\Exchange;
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
        Exchange::firstOrCreate(['name' => 'NASDAQ'], ['currency_id' => $usd->id]);
        Exchange::firstOrCreate(['name' => 'NYSE'], ['currency_id' => $usd->id]);
        Exchange::firstOrCreate(['name' => 'LSE'], ['currency_id' => $gbp->id]);
        Exchange::firstOrCreate(['name' => 'Euronext'], ['currency_id' => $eur->id]);
    }
}
