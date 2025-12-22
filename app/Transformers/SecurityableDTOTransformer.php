<?php

namespace App\Transformers;

use App\DTO\Securityable\SecurityableDTO;
use ReflectionClass;
use Spatie\TypeScriptTransformer\Structures\TransformedType;
use Spatie\TypeScriptTransformer\Transformers\Transformer;

class SecurityableDTOTransformer implements Transformer
{
    public function transform(ReflectionClass $class, string $name): ?TransformedType
    {
        if ($class->getName() !== SecurityableDTO::class) {
            return null;
        }

        $types = [
            "(StockDTO & { type: 'stock' })",
            "(BondDTO & { type: 'bond' })",
            "(CryptoDTO & { type: 'crypto' })",
        ];

        return TransformedType::create(
            $class,
            $name,
            implode(' | ', $types)
        );
    }
}
