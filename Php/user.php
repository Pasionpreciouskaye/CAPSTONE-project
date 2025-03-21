<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'registration_id', 'full_name', 'gender', 'birthday', 'contact_no', 'email',
        'address', 'region', 'province', 'city', 'barangay', 'purok',
        'youth_classification', 'civil_status', 'work_status', 'age_group',
        'is_registered_sk', 'is_registered_national', 'vote_count',
        'kk_assembly_attendance', 'educational_background', 'registration_date', 'password'
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'is_registered_sk' => 'boolean',
        'is_registered_national' => 'boolean',
        'registration_date' => 'datetime',
    ];
}
