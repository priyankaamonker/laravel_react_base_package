<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Enums\UserRole;

class UserController extends Controller
{
    public function index(Request $request): Response
    { 
        Gate::authorize('viewAny', User::class);

        $allowedSorts = [
            'name',
            'email',
            'created_at',
            'email_verified_at',
        ];

        $sort = in_array(
            $request->sort,
            $allowedSorts
        )
            ? $request->sort
            : 'created_at';

        $direction = $request->direction === 'asc'
            ? 'asc'
            : 'desc';

        $users = User::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', User::class);

        return Inertia::render('Users/Create', [
            'roles' => collect(UserRole::cases())
                ->reject(fn (UserRole $role) => $role === UserRole::SuperAdmin)
                ->map(fn (UserRole $role) => [
                    'value' => $role->value,
                    'label' => $role->getLabel(),
                ])
                ->values(),  
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        Gate::authorize('create', User::class);

        $data = $request->validated();

        $data['email_verified_at'] = $data['email_verified']
            ? now()
            : null;

        unset($data['email_verified']);

        User::create($data);

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');            
    }

    public function show(User $user): Response
    {
        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user): Response
    {
        Gate::authorize('update', $user);

        return Inertia::render('Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role?->value,
                'email_verified_at' => $user->email_verified_at?->format('Y-m-d'),
            ],

            'roles' => collect(UserRole::cases())
                ->reject(fn (UserRole $role) => $role === UserRole::SuperAdmin)
                ->map(fn (UserRole $role) => [
                    'value' => $role->value,
                    'label' => $role->getLabel(),
                ])
                ->values(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse 
    {
        Gate::authorize('update', $user);

        $data = $request->validated();

        $data['email_verified_at'] = $data['email_verified']
            ? now()
            : null;

        unset($data['email_verified']);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');            
    }

    public function destroy(User $user): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function sendVerificationEmail(User $user): RedirectResponse
    {
        Gate::authorize('update', $user);

        if ($user->hasVerifiedEmail()) {
            return back()->with('error', 'Email is already verified.');
        }

        $user->sendEmailVerificationNotification();

        return back()->with(
            'success',
            'Verification email sent successfully.'
        );
    }    
}