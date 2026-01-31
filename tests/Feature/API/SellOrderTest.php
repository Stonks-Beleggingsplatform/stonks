<?php

use App\Models\Holding;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can sell security', function () {
    $user = User::factory()->create();
    $portfolio = $user->portfolio;
    $portfolio->update(['cash' => 1000]);

    $stock = Stock::factory()->create();
    $security = $stock->security;
    $security->update(['price' => 10000]); // $100.00

    // Create an initial holding
    Holding::create([
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
    expect($user->refresh()->portfolio->cash)->toBe(1499.0)
        ->and(Holding::where('portfolio_id', $portfolio->id)->first()->quantity)->toBe(5);
});

test('user cannot sell more than held', function () {
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
});

test('user cannot sell non existent holding', function () {
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
});
