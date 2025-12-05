<?php

namespace App\Http\Controllers;

use App\DTO\SecurityDTO;
use App\Models\Security;

class SecurityController extends Controller
{
    public function show(Security $security): SecurityDTO
    {
        return SecurityDTO::fromModel($security);
    }
}
