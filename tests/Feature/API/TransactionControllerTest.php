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
        Order::factory()->count(3)->create([
            'type' => 'market',
        ])
    );

    foreach ($this->portfolio->orders as $order) {
        $order->transactions()->save(Transaction::factory()->make());
    }
});
