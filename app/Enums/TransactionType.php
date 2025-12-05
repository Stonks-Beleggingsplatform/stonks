<?php

namespace App\Enums;

enum TransactionType: string
{
    case DEPOSIT = 'deposit';
    case WITHDRAWAL = 'withdrawal';
    case BUY = 'buy';
    case SELL = 'sell';
    case DIVIDEND = 'dividend';
}
