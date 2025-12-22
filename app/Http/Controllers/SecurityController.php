<?php

namespace App\Http\Controllers;

use App\DTO\Securityable\BondDTO;
use App\DTO\Securityable\CryptoDTO;
use App\DTO\Securityable\StockDTO;
use App\DTO\SecurityDTO;
use App\Models\Security;
use App\Models\Stock;
use Illuminate\Http\Response;
use App\Models\Bond;
use App\Models\Crypto;

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

    public function show(Security $security): Response
    {
        $DTO = match ($security->securityable_type) {
            Stock::class => fn () => StockDTO::make($security->securityable),
            Crypto::class => fn () => CryptoDTO::make($security->securityable),
            Bond::class => fn() => BondDTO::make($security->securityable),
            default => fn() => SecurityDTO::make($security),
        };

        return response($DTO(), 200);
    }
}
