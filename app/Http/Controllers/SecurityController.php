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
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;

class SecurityController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = (int) $request->query('per_page', 10);
        $perPage = max(1, min(100, $perPage));
    
        $types = $this->resolveSecurityableTypes($request->query('type'));
    
        $query = Security::with(['securityable', 'exchange.currency'])
            ->orderBy('price', 'asc');
    
        if (!empty($types)) {
            $query->whereIn('securityable_type', $types);
        }

        $priceMin = $request->query('price_min');
        if ($priceMin !== null && is_numeric($priceMin)) {
            $minCents = max(0, (int) round(((float) $priceMin) * 100));
            $query->where('price', '>=', $minCents);
        }

        $priceMax = $request->query('price_max');
        if ($priceMax !== null && is_numeric($priceMax)) { 
            $maxCents = max(0, (int) round(((float) $priceMax) * 100));
            $query->where('price', '<=', $maxCents);
        }
    
        $securities = $query->paginate($perPage);
    
        $securities->setCollection(
            SecurityDTO::collection($securities->getCollection())
        );
    
        return response($securities, 200);
    }

   public function search(string $term, Request $request): Response
    {
        $types = $this->resolveSecurityableTypes($request->query('type'));

        $query = Security::with(['securityable', 'exchange.currency'])
            ->where(function ($q) use ($term) {
                $q->where('ticker', 'like', "%{$term}%")
                ->orWhere('name', 'like', "%{$term}%");
            });

        if (!empty($types)) {
            $query->whereIn('securityable_type', $types);
        }

        $priceMin = $request->query('price_min');
        if ($priceMin !== null && is_numeric($priceMin)) {
            $minCents = max(0, (int) round(((float) $priceMin) * 100));
            $query->where('price', '>=', $minCents);
        }

        $priceMax = $request->query('price_max');
        if ($priceMax !== null && is_numeric($priceMax)) {
            $maxCents = max(0, (int) round(((float) $priceMax) * 100));
            $query->where('price', '<=', $maxCents);
        }

        $securities = $query->limit(50)->get();

        return response(SecurityDTO::collection($securities), 200);
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

    private function resolveSecurityableTypes($input): array
{
    $map = [
        'crypto' => \App\Models\Crypto::class,
        'stock'  => \App\Models\Stock::class,
        'bond'   => \App\Models\Bond::class,
    ];

    if (empty($input)) {
        return [];
    }

    $types = is_array($input) ? $input : [$input];

    return array_values(array_unique(
        array_map(fn ($t) => $map[$t] ?? $t, $types)
    ));
}

    
}
