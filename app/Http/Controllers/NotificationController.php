<?php

namespace App\Http\Controllers;

use App\DTO\NotificationDTO;
use App\Models\Notification;
use App\Models\NotificationCondition;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    public function index(): Response
    {
        return response(NotificationDTO::collection(
            Notification::query()
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
            'notifiable_id' => ['required', 'integer'],
        ]);

        $condition = NotificationCondition::firstOrCreate([
            'notifiable_type' => $data['notifiable_type'],
            'notifiable_id' => $data['notifiable_id'],
            'field' => $data['field'],
            'operator' => $data['operator'],
            'value' => $data['value'],
        ]);

        return response($condition, 200);
    }

    public function destroyCondition(NotificationCondition $condition): Response
    {
        $condition->delete();

        return response(null, 204);
    }
}
