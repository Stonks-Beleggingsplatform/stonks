<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('watchlist_security', function (Blueprint $table) {
            $table->id();

            $table->foreignId('watchlist_id')->constrained()->onDelete('cascade');
            $table->foreignId('security_id')->constrained()->onDelete('cascade');

            $table->timestamps();

            if (!app()->environment('testing')) {
                $table->unique(['watchlist_id', 'security_id']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watchlist_security');
    }
};
