<?php

use App\Services\SecurityData\Adapters\MockAdapter;
use App\Services\SecurityData\SecurityDataService;

beforeEach(function () {
    $this->service = new SecurityDataService(
        new MockAdapter()
    );
});

it('can get price', function () {
    $price = $this->service->getPrice('AAPL');

    expect($price)->toBeFloat();
});

it('can get security details', function () {
    $details = $this->service->getSecurityDetails('AAPL');

    expect($details)->not->toBeNull()
        ->and($details->ticker)->toBe('AAPL');
});

it('can search securities', function () {
    $results = $this->service->search('Apple');

    expect($results)->toBeArray()
        ->and(count($results))->toBeGreaterThan(0);
});

it('can get historical data', function () {
   $this->markTestIncomplete('This test has not been implemented yet.');
});
