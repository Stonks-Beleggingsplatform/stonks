<?php

use App\Models\Portfolio;
use App\DTO\PortfolioDTO;

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
        ->and($response->json('cash'))->toBeFloat()
        ->and($response->json('total_value'))->toBeFloat()
        ->and($response->json('total_return'))->toBeFloat();
});

