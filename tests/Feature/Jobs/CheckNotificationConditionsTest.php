<?php

use App\Enums\Comparator;
use App\Jobs\CheckNotificationConditions;
use App\Models\Exchange;
use App\Models\Notification;
use App\Models\NotificationCondition;
use App\Models\Security;
use App\Models\Stock;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();

    $this->stock = Stock::factory()->create();

    $this->security = $this->stock->security;
});

it('creates notifications when conditions are met', function () {
    NotificationCondition::factory()->create([
        'user_id' => $this->user->id,
        'notifiable_type' => Stock::class,
        'notifiable_id' => $this->stock->id,
        'field' => 'price',
        'operator' => Comparator::GREATER_THAN,
        'value' => 100,
    ]);

    (new CheckNotificationConditions())->handle();

    expect(Notification::where('user_id', $this->user->id)->count())->toBe(1)
        ->and(Notification::first()->message)->toContain($this->stock->ticker)
        ->toContain('price');
});

it('does not create notifications when conditions are not met', function () {
    $this->security->update(['price' => 50.00]);

    NotificationCondition::factory()->create([
        'user_id' => $this->user->id,
        'notifiable_type' => Stock::class,
        'notifiable_id' => $this->stock->id,
        'field' => 'price',
        'operator' => Comparator::GREATER_THAN,
        'value' => 100,
    ]);

    (new CheckNotificationConditions())->handle();

    expect(Notification::count())->toBe(0);
});

it('does not create duplicate notifications', function () {
    $condition = NotificationCondition::factory()->create([
        'user_id' => $this->user->id,
        'notifiable_type' => Stock::class,
        'notifiable_id' => $this->stock->id,
        'field' => 'price',
        'operator' => Comparator::GREATER_THAN,
        'value' => 100,
    ]);

    Notification::factory()->create([
        'user_id' => $this->user->id,
        'notification_condition_id' => $condition->id,
    ]);

    (new CheckNotificationConditions())->handle();

    expect(Notification::count())->toBe(1);
});

it('handles multiple users with different conditions', function () {
    $this->security->update(['price' => 150.00]);

    $user2 = User::factory()->create();

    NotificationCondition::factory()->create([
        'user_id' => $this->user->id,
        'notifiable_type' => Stock::class,
        'notifiable_id' => $this->stock->id,
        'field' => 'price',
        'operator' => Comparator::GREATER_THAN,
        'value' => 100,
    ]);

    NotificationCondition::factory()->create([
        'user_id' => $user2->id,
        'notifiable_type' => Stock::class,
        'notifiable_id' => $this->stock->id,
        'field' => 'price',
        'operator' => Comparator::LESS_THAN,
        'value' => 200,
    ]);

    (new CheckNotificationConditions())->handle();

    expect(Notification::count())->toBe(2)
        ->and(Notification::where('user_id', $this->user->id)->exists())->toBeTrue()
        ->and(Notification::where('user_id', $user2->id)->exists())->toBeTrue();
});


it('skips conditions with missing notifiable', function () {
    NotificationCondition::factory()->create([
        'user_id' => $this->user->id,
        'notifiable_type' => Stock::class,
        'notifiable_id' => 99999,
        'field' => 'price',
        'operator' => Comparator::GREATER_THAN,
        'value' => 100,
    ]);

    (new CheckNotificationConditions())->handle();

    expect(Notification::count())->toBe(0);
});
