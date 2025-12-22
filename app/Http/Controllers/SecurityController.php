<?php

namespace App\Http\Controllers;

use App\DTO\Securityable\BondDTO;
use App\DTO\Securityable\CryptoDTO;
use App\DTO\Securityable\StockDTO;
use App\DTO\SecurityDTO;
use App\Models\Bond;
use App\Models\Crypto;
use App\Models\Security;
use App\Models\Stock;
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

    public function show(string $ticker): Response
    {
        $security = Security::query()
            ->where('ticker', strtoupper($ticker))
            ->with('securityable')
            ->firstOrFail();

        $DTO = match ($security->securityable_type) {
            Stock::class => StockDTO::make($security->securityable),
            Crypto::class => CryptoDTO::make($security->securityable),
            Bond::class => BondDTO::make($security->securityable),
            default => SecurityDTO::make($security),
        };

        return response($DTO, 200);
    }
}
