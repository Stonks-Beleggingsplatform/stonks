<?php

namespace App\Jobs;

use App\Enums\Comparator;
use App\Models\Notification;
use App\Models\NotificationCondition;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Collection;

class CheckNotificationConditions implements ShouldQueue
{
    use Queueable;


    public function handle(): void
    {
        User::query()
            ->whereHas('notificationConditions')
            ->with('notificationConditions.notifiable')
            ->chunkById(50, function (Collection $users) {
                foreach ($users as $user) {
                    $this->checkConditionsForUser($user);
                }
            }, 'id', 'users');
    }

    protected function checkConditionsForUser(User $user): void
    {
        $existingNotifications = Notification::query()
            ->where('user_id', $user->id)
            ->pluck('notification_condition_id');

        $conditions = NotificationCondition::query()
            ->where('user_id', $user->id)
            ->with('notifiable')
            ->whereNotIn('id', $existingNotifications)
            ->get();

        foreach ($conditions as $condition) {
            $notifiable = $condition->notifiable;

            if (!$notifiable) {
                continue;
            }

            $fieldValue = $notifiable->getAttribute($condition->field);

            if ($this->evaluateCondition($fieldValue, $condition->operator, $condition->value)) {
                Notification::create([
                    'user_id' => $user->id,
                    'notification_condition_id' => $condition->id,
                    'message' => sprintf(
                        '%s %s %s %s',
                        $notifiable->ticker,
                        $condition->field,
                        $condition->operator->value,
                        $condition->value
                    ),
                ]);
            }
        }
    }

    protected function evaluateCondition($fieldValue, Comparator $operator, $conditionValue): bool
    {
        return match ($operator) {
            Comparator::EQUAL => $fieldValue == $conditionValue,
            Comparator::NOT_EQUAL => $fieldValue != $conditionValue,
            Comparator::LESS_THAN => $fieldValue < $conditionValue,
            Comparator::GREATER_THAN => $fieldValue > $conditionValue,
            Comparator::LESS_THAN_OR_EQUAL => $fieldValue <= $conditionValue,
            Comparator::GREATER_THAN_OR_EQUAL => $fieldValue >= $conditionValue,
        };
    }
}
