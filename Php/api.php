use App\Http\Controllers\AuthController;

Route::post('/signup', [AuthController::class, 'signup']);
