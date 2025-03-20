<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('registration_id')->unique();
            $table->string('full_name');
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->date('birthday');
            $table->string('contact_no');
            $table->string('email')->unique();
            $table->text('address');
            $table->string('region');
            $table->string('province');
            $table->string('city');
            $table->string('barangay');
            $table->string('purok');
            $table->string('youth_classification');
            $table->string('civil_status');
            $table->string('work_status');
            $table->string('age_group');
            $table->boolean('is_registered_sk')->default(false);
            $table->boolean('is_registered_national')->default(false);
            $table->integer('vote_count')->default(0);
            $table->integer('kk_assembly_attendance')->default(0);
            $table->string('educational_background');
            $table->timestamp('registration_date')->useCurrent();
            $table->string('password');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
