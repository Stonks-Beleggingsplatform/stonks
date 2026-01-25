<?php

use App\DTO\NotificationDTO;
use App\Models\Bond;

test('index', function () {
    $notification = \App\Models\Notification::factory()->create([
        'user_id' => $this->user->id,
    ]);

    $response = $this->getJson(route('notifications.index'));

    expect($response->status())->toBe(200)
        ->and($response->json())->toMatchArray([NotificationDTO::make($notification)->jsonSerialize()]);
});

test('storeCondition', function () {
    $notifiable = Bond::factory()->create();

    $payload = [
        'field' => 'price',
        'operator' => '>=',
        'value' => 105.5,
        'notifiable_type' => get_class($notifiable),
        'notifiable_id' => $notifiable->id,
    ];

    $response = $this->postJson(route('notifications.conditions.store'), $payload);

    expect($response->status())->toBe(200)
        ->and($response->json('field'))->toBe($payload['field'])
        ->and($response->json('operator'))->toBe($payload['operator'])
        ->and($response->json('value'))->toBe($payload['value'])
        ->and($response->json('notifiable_type'))->toBe($payload['notifiable_type'])
        ->and($response->json('notifiable_id'))->toBe($payload['notifiable_id']);
});
