<?php

namespace App\Http\Controllers;

use App\DTO\NotificationConditionDTO;
use App\DTO\NotificationDTO;
use App\Models\Notification;
use App\Models\NotificationCondition;
use App\Models\Security;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        return response(NotificationDTO::collection(
            Notification::query()
                ->where('user_id', auth()->id())
                ->with(['notificationCondition.notifiable'])
                ->get()
        ), 200);
    }

    public function indexConditions(): Response
    {
        return response(NotificationConditionDTO::collection(
            NotificationCondition::query()
                ->where('user_id', auth()->id())
                ->get()
        ), 200);
    }

    public function storeCondition(Request $request): Response
    {
        $data = $request->validate([
            'field' => ['required', 'string'],
            'operator' => ['required', 'in:=,!=,<,>,<=,>='],
            'value' => ['required', 'numeric'],
            'notifiable_type' => ['required', 'string'],
            'ticker' => ['required', 'string', 'exists:securities,ticker'],
        ]);

        $security = Security::where('ticker', $data['ticker'])->firstOrFail();
        $notifiable = $security->securityable;

        if (!$notifiable) {
            return response([
                'message' => 'Security type not found',
                'errors' => ['ticker' => ['Could not determine security type']],
            ], 422);
        }

        $condition = NotificationCondition::firstOrCreate([
            'notifiable_type' => get_class($notifiable),
            'notifiable_id' => $notifiable->id,
            'field' => $data['field'],
            'operator' => $data['operator'],
            'value' => $data['value'],
            'user_id' => auth()->id(),
        ]);

        return response($condition, 200);
    }

    public function destroyCondition(NotificationCondition $condition): Response
    {
        // Check if user owns any notification with this condition
        $notification = Notification::where('user_id', auth()->id())
            ->where('notification_condition_id', $condition->id)
            ->first();

        if (!$notification) {
            return response(['message' => 'Unauthorized'], 403);
        }

        $condition->delete();

        return response(null, 204);
    }
}
