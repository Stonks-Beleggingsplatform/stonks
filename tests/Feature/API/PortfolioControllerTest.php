<?php

use App\DTO\PortfolioDTO;
use App\Models\Portfolio;

test('index', function () {
    $portfolio = Portfolio::factory()->create([
        'user_id' => $this->user->id,
        'cash' => 100000,
    ]);

    $response = $this->getJson(route('portfolio.index'));

    $portfolio->load(['user', 'holdings', 'orders']);

    $portfolioDTO = PortfolioDTO::make($portfolio);

    expect($response->status())->toBe(200)
        ->and($response->json('user_id'))->toBe($this->user->id)
        ->and($response->json('cash'))->toBeInt()
        ->and($response->json('total_value'))->toBeInt()
        ->and($response->json('total_return'))->toBeInt();
});

