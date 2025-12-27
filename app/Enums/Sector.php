<?php

namespace App\Enums;

enum Sector: string
{
    case Technology = 'technology';
    case Finance = 'finance';
    case Healthcare = 'healthcare';
    case Retail = 'retail';
    case Manufacturing = 'manufacturing';
    case Energy = 'energy';
    case Transportation = 'transportation';
    case RealEstate = 'real_estate';
}
