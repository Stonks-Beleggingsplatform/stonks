<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bonds', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('nominal_value');
            $table->integer('coupon_rate');
            $table->date('maturity_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bonds');
    }
};
