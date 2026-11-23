<?php

namespace App\Http\Controllers\Training;

use App\Http\Controllers\Controller;
use App\Http\Requests\Training\StoreStakeholderRequest;
use App\Http\Requests\Training\UpdateStakeholderRequest;
use App\Models\Organization;
use App\Models\Role;
use App\Models\Stakeholder;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class StakeholderController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Stakeholder::class);

        $query = Stakeholder::query()->with(['organization', 'role']);

        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role') && $request->input('role') !== 'All') {
            $query->where('role_id', $request->input('role'));
        }

        if ($request->filled('organization_id') && $request->input('organization_id') !== 'All') {
            $query->where('organization_id', $request->input('organization_id'));
        }

        if ($request->filled('influence') && $request->input('influence') !== 'All') {
            $query->where('influence', $request->input('influence'));
        }

        $user = $request->user();

        $stakeholders = $query
            ->orderedByInfluence()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Stakeholder $stakeholder) => [
                'id' => $stakeholder->id,
                'name' => $stakeholder->name,
                'email' => $stakeholder->email,
                'role' => $stakeholder->role_id,
                'influence' => $stakeholder->influence,
                'organization' => $stakeholder->organization->name,
                'organization_id' => $stakeholder->organization_id,
                'can' => [
                    'delete' => $user ? $user->can('delete', $stakeholder) : false,
                ],
            ]);

        $availableRoles = Role::query()->get(['id', 'title']);
        $availableOrganizations = Organization::query()->get(['id', 'name']);

        return Inertia::render('training/stakeholders/index', [
            'stakeholders' => $stakeholders,
            'filters' => [
                'search' => $request->input('search', ''),
                'role' => $request->input('role', ''),
                'organization_id' => $request->input('organization_id', ''),
                'influence' => $request->input('influence', ''),
            ],
            'availableRoles' => $availableRoles,
            'availableOrganizations' => $availableOrganizations,
        ]);
    }

    public function show(Stakeholder $stakeholder): Response
    {
        Gate::authorize('view', $stakeholder);

        $stakeholder->load(['organization', 'role']);
        $availableRoles = Role::query()->get(['id', 'title']);
        $user = request()->user();

        return Inertia::render('training/stakeholders/show', [
            'stakeholder' => [
                'id' => $stakeholder->id,
                'name' => $stakeholder->name,
                'email' => $stakeholder->email,
                'role' => $stakeholder->role_id,
                'influence' => $stakeholder->influence,
                'organization' => $stakeholder->organization->name,
                'active' => $stakeholder->active,
                'notes' => $stakeholder->notes,
                'can' => [
                    'update' => $user ? $user->can('update', $stakeholder) : false,
                ],
            ],
            'availableRoles' => $availableRoles,
        ]);
    }

    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()->cannot('create', Stakeholder::class)) {
            return redirect()
                ->route('training.stakeholders.index')
                ->with('error', 'Помилка 403: у вас недостатньо прав для створення стейкхолдера.');
        }

        return Inertia::render('training/stakeholders/create', [
            'availableRoles' => Role::query()->get(['id', 'title']),
            'availableOrganizations' => Organization::query()->get(['id', 'name']),
        ]);
    }

    public function store(StoreStakeholderRequest $request): RedirectResponse
    {
        if ($request->user()->cannot('create', Stakeholder::class)) {
            return redirect()
                ->route('training.stakeholders.index')
                ->with('error', 'Помилка 403: у вас недостатньо прав для створення стейкхолдера.');
        }

        $data = $request->validated();

        if (array_key_exists('role', $data)) {
            $data['role_id'] = $data['role'];
            unset($data['role']);
        }

        $stakeholder = Stakeholder::create($data);

        return redirect()
            ->route('training.stakeholders.show', $stakeholder->id)
            ->with('success', 'Stakeholder created');
    }

    public function edit(Request $request, Stakeholder $stakeholder): Response|RedirectResponse
    {
        if ($request->user()->cannot('update', $stakeholder)) {
            return redirect()
                ->route('training.stakeholders.index')
                ->with('error', 'Помилка 403: у вас недостатньо прав для редагування цього стейкхолдера.');
        }

        $stakeholder->load(['organization', 'role']);

        return Inertia::render('training/stakeholders/edit', [
            'stakeholder' => [
                'id' => $stakeholder->id,
                'name' => $stakeholder->name,
                'email' => $stakeholder->email,
                'role' => $stakeholder->role_id,
                'influence' => $stakeholder->influence,
                'organization_id' => $stakeholder->organization_id,
                'notes' => $stakeholder->notes,
            ],
            'availableRoles' => Role::query()->get(['id', 'title']),
            'availableOrganizations' => Organization::query()->get(['id', 'name']),
        ]);
    }

    public function update(UpdateStakeholderRequest $request, Stakeholder $stakeholder): RedirectResponse
    {
        if ($request->user()->cannot('update', $stakeholder)) {
            return redirect()
                ->route('training.stakeholders.index')
                ->with('error', 'Помилка 403: у вас недостатньо прав для редагування цього стейкхолдера.');
        }

        $data = $request->validated();

        if (array_key_exists('role', $data)) {
            $data['role_id'] = $data['role'];
            unset($data['role']);
        }

        $stakeholder->update($data);

        return redirect()
            ->route('training.stakeholders.show', $stakeholder->id)
            ->with('success', 'Stakeholder updated');
    }

    public function destroy(Stakeholder $stakeholder): RedirectResponse
    {
        Gate::authorize('delete', $stakeholder);

        $stakeholder->delete();

        return redirect()
            ->route('training.stakeholders.index')
            ->with('success', 'Stakeholder deleted');
    }
}
