<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('fees', function (Blueprint $table) {
            $table->string('type')->default('transaction')->after('transaction_id');

            // Re-evaluate the unique constraint to include type
            $table->dropUnique(['exchange_id', 'transaction_id']);
            $table->unique(['exchange_id', 'transaction_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fees', function (Blueprint $table) {
            $table->dropUnique(['exchange_id', 'transaction_id', 'type']);
            $table->unique(['exchange_id', 'transaction_id']);
            $table->dropColumn('type');
        });
    }
};
