<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $request->validate([
            'registration_id' => 'required|unique:users,registration_id',
            'full_name' => 'required|string',
            'gender' => 'required|string',
            'birthday' => 'required|date',
            'contact_no' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'address' => 'required|string',
            'region' => 'required|string',
            'province' => 'required|string',
            'city' => 'required|string',
            'barangay' => 'required|string',
            'purok' => 'required|string',
            'youth_classification' => 'required|string',
            'civil_status' => 'required|string',
            'work_status' => 'required|string',
            'age_group' => 'required|string',
            'is_registered_sk' => 'required|boolean',
            'is_registered_national' => 'required|boolean',
            'vote_count' => 'required|integer',
            'kk_assembly_attendance' => 'required|integer',
            'educational_background' => 'required|string',
            'password' => 'required|string|min:6',
            'confirmPassword' => 'required|string|same:password',
        ]);

        $user = User::create([
            'registration_id' => $request->registration_id,
            'full_name' => $request->full_name,
            'gender' => $request->gender,
            'birthday' => $request->birthday,
            'contact_no' => $request->contact_no,
            'email' => $request->email,
            'address' => $request->address,
            'region' => $request->region,
            'province' => $request->province,
            'city' => $request->city,
            'barangay' => $request->barangay,
            'purok' => $request->purok,
            'youth_classification' => $request->youth_classification,
            'civil_status' => $request->civil_status,
            'work_status' => $request->work_status,
            'age_group' => $request->age_group,
            'is_registered_sk' => $request->is_registered_sk,
            'is_registered_national' => $request->is_registered_national,
            'vote_count' => $request->vote_count,
            'kk_assembly_attendance' => $request->kk_assembly_attendance,
            'educational_background' => $request->educational_background,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'User registered successfully'], 201);
    }
}
