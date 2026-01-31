<?php

use App\Enums\Comparator;
use App\Models\Concerns\Securityable;
use App\Models\Notification;
use App\Models\NotificationCondition;

beforeEach(function () {
    $this->notificationCondition = NotificationCondition::factory()
        ->hasNotifications()
        ->create();
});

test('notification attributes', function () {
    expect($this->notificationCondition)->toBeInstanceOf(NotificationCondition::class)
        ->and($this->notificationCondition->operator)->toBeInstanceOf(Comparator::class)
        ->and($this->notificationCondition->field)->toBeString()
        ->and($this->notificationCondition->value)->toBeInt();
});

test('notification condition relations', function () {
    expect($this->notificationCondition->notifications->first())->toBeInstanceOf(Notification::class)
        ->and($this->notificationCondition->notifiable)->toBeInstanceOf(Securityable::class);
});
