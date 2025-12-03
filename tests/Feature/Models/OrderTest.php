<?php

use App\Enums\OrderAction;
use App\Enums\OrderStatus;
use App\Enums\OrderType;
use App\Models\Order;
use App\Models\Portfolio;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;
use App\Models\Security;

beforeEach(function () {
    $this->order = Order::factory()->create();
});

test('order attributes', function () {
    expect($this->order)->toBeInstanceOf(Order::class)
        ->and($this->order->quantity)->toBeBetween(1, 100)
        ->and($this->order->price)->toBeBetween(10, 1000)
        ->and($this->order->type)->toBeInstanceOf(OrderType::class)
        ->and($this->order->action)->toBeInstanceOf(OrderAction::class)
        ->and($this->order->status)->toBeInstanceOf(OrderStatus::class)
        ->and($this->order->end_date)->toBeInstanceOf(CarbonInterface::class);
});

test('order relationships', function () {
    expect($this->order->portfolio)->toBeInstanceOf(Portfolio::class)
        ->and($this->order->security)->toBeInstanceOf(Security::class);
});
