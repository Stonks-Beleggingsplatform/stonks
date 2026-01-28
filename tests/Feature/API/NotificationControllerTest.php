<?php

use App\DTO\NotificationDTO;
use App\Models\Bond;
use App\Models\NotificationCondition;

test('index', function () {
    $notification = \App\Models\Notification::factory()->create([
        'user_id' => $this->user->id,
    ]);

    $response = $this->getJson(route('notifications.index'));

    expect($response->status())->toBe(200)
        ->and($response->json())->toMatchArray([NotificationDTO::make($notification)->jsonSerialize()]);
});

test('storeCondition', function () {
    $bond = Bond::factory()->create();
    $security = $bond->security;

    $payload = [
        'field' => 'price',
        'operator' => '>=',
        'value' => 105.5,
        'ticker' => $security->ticker,
        'notifiable_type' => get_class($bond),
    ];

    $response = $this->postJson(route('notifications.conditions.store'), $payload);

    expect($response->status())->toBe(200)
        ->and($response->json('field'))->toBe($payload['field'])
        ->and($response->json('operator'))->toBe($payload['operator'])
        ->and($response->json('value'))->toBe($payload['value'])
        ->and($response->json('notifiable_type'))->toBe($payload['notifiable_type'])
        ->and($response->json('notifiable_id'))->toBe($bond->id);
});


test('destroyCondition', function () {
    $condition = NotificationCondition::factory()->create([
        'user_id' => $this->user->id,
    ]);

    $response = $this->deleteJson(route('notifications.conditions.destroy', ['condition' => $condition->id]));

    expect($response->status())->toBe(204);
});
