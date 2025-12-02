<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('holdings', function (Blueprint $table) {
        $table->id();

        $table->foreignId('portfolio_id')->constrained()->onDelete('cascade');
        $table->foreignId('security_id')->constrained()->onDelete('cascade');

        $table->integer('quantity', 15, 4);
        $table->integer('purchase_price', 15, 4)->nullable();
        $table->integer('avg_price', 15, 4)->nullable();
        $table->integer('gain_loss', 15, 4)->nullable();

        $table->timestamps();

        $table->unique(['portfolio_id', 'security_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('holdings');
    }
};
