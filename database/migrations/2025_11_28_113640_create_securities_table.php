<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('securities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exchange_id')->constrained()->onDelete('cascade');

            $table->string('ticker')->unique();
            $table->string('name');
            $table->integer('price');

            $table->morphs('securityable');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('securities');
    }
};
