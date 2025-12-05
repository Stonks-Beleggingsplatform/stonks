<?php

use App\DTO\SecurityDTO;
use App\Models\Bond;
use App\Models\Security;
use App\Models\Stock;

beforeEach(function () {
    $this->securities = [
        Stock::factory(3)->create(),
        Bond::factory(2)->create(),
    ];

    $this->securities = collect($this->securities)->flatten();

    $this->tickers = $this->securities->map(fn($s) => $s->security->ticker)->toArray();
});

test('show', function () {
    $randomTicker = $this->tickers[array_rand($this->tickers)];

    $response = $this->getJson(route('security.show', ['security' => $randomTicker]));

    expect($response->status())->toBe(200)
        ->and($response->json())
        ->toBe(SecurityDTO::fromModel(
            Security::where('ticker', $randomTicker)->firstOrFail()
        )->toArray());
});
