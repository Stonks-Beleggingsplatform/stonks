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
use App\Services\SecurityData\SecurityDataService;
use Illuminate\Http\Resources\Json\JsonResource;
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

        if (count($matchingSecurities) === 0) {
            $matchingSecurities = (new SecurityDataService)->search($term);
        }

        return response($matchingSecurities, 200);
    }

    public function show(string $ticker): Response
    {
        $security = Security::query()
            ->where('ticker', strtoupper($ticker))
            ->with(['securityable', 'exchange.currency'])
            ->firstOrFail();

        $DTO = match ($security->securityable_type) {
            Stock::class => StockDTO::make($security->securityable),
            Crypto::class => CryptoDTO::make($security->securityable),
            Bond::class => BondDTO::make($security->securityable),
            default => SecurityDTO::make($security),
        };

        $securityablePayload = $DTO instanceof JsonResource
            ? $DTO->toArray(request())
            : $DTO;

        return response(array_merge(
            is_array($securityablePayload) ? $securityablePayload : (array) $securityablePayload,
            [
                'id' => $security->id,
                'ticker' => $security->ticker,
                'name' => $security->name,
                'price' => $security->price / 100,
                'exchange' => $security->relationLoaded('exchange') ? [
                    'id' => $security->exchange?->id,
                    'name' => $security->exchange?->name,
                    'currency' => $security->exchange?->currency ? [
                        'id' => $security->exchange->currency->id,
                        'name' => $security->exchange->currency->name,
                    ] : null,
                ] : null,
                'dto_type' => strtolower(class_basename($security->securityable_type)),
            ]
        ), 200);
    }
}
