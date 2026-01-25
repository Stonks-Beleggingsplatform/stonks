<?php

namespace Tests\Feature\API;

use App\Models\Stock;
use App\Models\Holding;
use App\Models\Portfolio;
use App\Models\Security;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SellOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_sell_security()
    {
        $user = User::factory()->create();
        $portfolio = $user->portfolio;
        $portfolio->update(['cash' => 1000]);
        
        $stock = Stock::factory()->create();
        $security = $stock->security;
        $security->update(['price' => 10000]); // $100.00
        
        // Create an initial holding
        $hold = Holding::create([
            'portfolio_id' => $portfolio->id,
            'security_id' => $security->id,
            'quantity' => 10,
            'purchase_price' => 9000,
            'avg_price' => 9000,
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/orders', [
                'security_id' => $security->id,
                'quantity' => 5,
                'action' => 'sell',
                'type' => 'market',
            ]);

        $response->assertStatus(201);
        $response->assertJson([
            'message' => 'Security sold successfully',
        ]);

        // Check cash update: 1000 + (5 * 100 - fee)
        // subtotal = 500.00
        // fee = 500 * 0.002 = 1.00
        // proceeds = 499.00
        // final cash = 1000 + 499 = 1499.00
        $this->assertEquals(1499, $user->refresh()->portfolio->cash);
        $this->assertEquals(5, Holding::where('portfolio_id', $portfolio->id)->first()->quantity);
    }

    public function test_user_cannot_sell_more_than_held()
    {
        $user = User::factory()->create();
        $portfolio = $user->portfolio;
        $stock = Stock::factory()->create();
        $security = $stock->security;
        $security->update(['price' => 10000]);

        Holding::create([
            'portfolio_id' => $portfolio->id,
            'security_id' => $security->id,
            'quantity' => 2,
            'purchase_price' => 9000,
            'avg_price' => 9000,
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/orders', [
                'security_id' => $security->id,
                'quantity' => 5,
                'action' => 'sell',
                'type' => 'market',
            ]);

        $response->assertStatus(422);
    }

    public function test_user_cannot_sell_non_existent_holding()
    {
        $user = User::factory()->create();
        $portfolio = $user->portfolio;
        $stock = Stock::factory()->create();
        $security = $stock->security;

        $response = $this->actingAs($user)
            ->postJson('/api/orders', [
                'security_id' => $security->id,
                'quantity' => 1,
                'action' => 'sell',
                'type' => 'market',
            ]);

        $response->assertStatus(422);
    }
}
