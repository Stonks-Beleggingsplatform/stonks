<?php

namespace App\Http\Controllers;

use App\DTO\SecurityDTO;
use App\Models\Security;
use Illuminate\Http\Response;

class SecurityController extends Controller
{
    public function index(string $term): Response
    {
        $lowerTerm = strtolower($term);

        $matchingSecurities =
            SecurityDTO::collection(
                Security::where(function ($query) use ($lowerTerm) {
                    $query->whereRaw('LOWER(ticker) LIKE ?', ["%{$lowerTerm}%"])
                        ->orWhereRaw('LOWER(name) LIKE ?', ["%{$lowerTerm}%"]);
                })
                    ->get()
            );

        // TODO: when no matches found, call external API to fetch security data

        return response($matchingSecurities, 200);
    }
}
