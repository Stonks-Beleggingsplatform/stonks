<?php

namespace App\Http\Controllers;

use App\DTO\SecurityDTO;
use App\Models\Security;
use Illuminate\Http\Response;

class SecurityController extends Controller
{
    public function index(string $term): Response
    {
        $matchingSecurities =
            SecurityDTO::collection(
                Security::where('ticker', 'LIKE', "%{$term}%")
                    ->orWhere('name', 'LIKE', "%{$term}%")
                    ->get()
            );

        //TODO: when no matches found, call external API to fetch security data

        return response($matchingSecurities, 200);
    }
}
