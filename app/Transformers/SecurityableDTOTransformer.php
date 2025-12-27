<?php

namespace App\Transformers;

use App\DTO\SecurityDTO;
use ReflectionClass;
use Spatie\TypeScriptTransformer\Structures\TransformedType;
use Spatie\TypeScriptTransformer\Transformers\Transformer;

class SecurityableDTOTransformer implements Transformer
{
    public function transform(ReflectionClass $class, string $name): ?TransformedType
    {
        if ($class->getName() !== SecurityDTO::class) {
            return null;
        }

        $types = [
            "(StockDTO & { dto_type: 'stock' })",
            "(BondDTO & { dto_type: 'bond' })",
            "(CryptoDTO & { dto_type: 'crypto' })",
        ];

        return TransformedType::create(
            $class,
            $name,
            implode(' | ', $types)
        );
    }
}
