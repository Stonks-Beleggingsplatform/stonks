<?php

namespace App\DTO;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class CompanyDTO extends DTO
{
    public string $name;

    public array $sectors;

    public int $employee_count;

    public int $market_cap;

    public string $email;

    public string $phone;

    public string $street;

    public string $zip_code;

    public string $city;

    public string $country;

    public string $about;
}
