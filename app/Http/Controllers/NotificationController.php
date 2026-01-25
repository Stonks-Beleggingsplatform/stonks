<?php

namespace App\Http\Controllers;

use App\DTO\NotificationDTO;
use App\Models\Notification;
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
}
