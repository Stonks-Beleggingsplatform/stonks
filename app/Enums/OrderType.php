<?php

namespace App\Enums;

enum OrderType: string
{
    case MARKET = 'market';
    case LIMIT = 'limit';
}
