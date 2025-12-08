<?php

use App\DTO\PortfolioDTO;
use App\Models\Portfolio;

beforeEach(function () {
    $this->portfolio = Portfolio::factory()->create([
        'user_id' => $this->user->id,
        'cash' => 50000,
    ]);

    $this->user->refresh();
});

test('show', function () {
    $response = $this->getJson(route('portfolio.show'));

    expect($response->status())->toBe(200)
        ->and($response->json())->toBe(PortfolioDTO::make($this->portfolio)->toArray());
});
