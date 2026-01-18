<?php

use App\DTO\PortfolioDTO;
use App\Models\Portfolio;

test('index', function () {
    Portfolio::factory()->create([
        'user_id' => $this->user->id,
        'cash' => 50000,
    ]);

    $response = $this->getJson(route('portfolio.index'));

    $portfolioDTO = PortfolioDTO::collection(
        Portfolio::where('user_id', $this->user->id)
            ->with(['user', 'holdings', 'orders'])
            ->get()
    );

    expect($response->status())->toBe(200)
        ->and($response->json())->toEqual(
            $portfolioDTO
                ->map(fn (PortfolioDTO $dto) => $dto->jsonSerialize())
                ->toArray()
        );
});
