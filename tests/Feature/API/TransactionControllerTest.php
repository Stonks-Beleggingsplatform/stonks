<?php

use App\DTO\TransactionDTO;
use App\Models\Order;
use App\Models\Portfolio;
use App\Models\Transaction;

beforeEach(function () {
    $this->portfolio = Portfolio::factory()
        ->for($this->user)
        ->create();

    $this->portfolio->orders()->saveMany(
        Order::factory()->count(3)->create()
    );

    foreach ($this->portfolio->orders as $order) {
        $order->transactions()->save(Transaction::factory()->make());
    }
});

test('index returns the users transactions', function () {
    $response = $this->getJson(route('transactions.index'));

    $this->portfolio->orders->load('transactions');

    expect($response->status())->toBe(200)
        ->and($response->json())->toHaveCount(3)
        ->and($response->json()[0])->toMatchArray(TransactionDTO::make($this->portfolio->orders->first()->transactions->first())->jsonSerialize());
});
