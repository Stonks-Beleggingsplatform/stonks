<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Portfolio;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Watchlist;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()
            ->has(
                Watchlist::factory(3)
            )
            ->has(
                Portfolio::factory()
                    ->has(
                        Order::factory()
                            ->has(Transaction::factory())
                            ->count(5)
                    )
            )
            ->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
    }
}
