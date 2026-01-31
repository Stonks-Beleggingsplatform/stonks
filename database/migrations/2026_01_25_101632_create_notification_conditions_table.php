<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('field');
            $table->string('operator');
            $table->string('value');
            $table->morphs('notifiable');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_conditions');
    }
};
