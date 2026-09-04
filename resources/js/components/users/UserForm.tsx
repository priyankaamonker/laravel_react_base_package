import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface User {
    id?: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string|null;
}

interface Role {
    value: string;
    label: string;
}

interface Props {
    user?: User;
    roles: Role[];
    submitUrl: string;
    method?: 'post' | 'put';
}

export default function UserForm({
    user,
    roles,
    submitUrl,
    method = 'post',
}: Props) {
    const { data, setData, post, put, processing, errors } =
        useForm({
            name: user?.name ?? '',
            email: user?.email ?? '',
            role: user?.role ?? '',
            password: '',
            password_confirmation: '',
            email_verified: user?.email_verified_at !== null,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (method === 'put') {
            put(submitUrl);
        } else {
            post(submitUrl);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    return (
        <form
            onSubmit={submit}
            className="max-w-xl space-y-6"
        >
            <div>
                <label 
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium"
                >
                    Name
                </label>

                <input
                    value={data.name}
                    onChange={(e) =>
                        setData('name', e.target.value)
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm font-medium"
                    required
                />

                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.name}
                    </p>
                )}
            </div>

            <div>
                <label 
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                >
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) =>
                        setData('email', e.target.value)
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm font-medium"
                    required
                />

                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                    </p>
                )}
            </div>

            <div>
                <label 
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium"
                >
                    Role
                </label>

                <select
                    id="role"
                    value={data.role}
                    onChange={(e) =>
                        setData('role', e.target.value)
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm font-medium"
                    required
                >
                    <option value="">
                        Select a role
                    </option>

                    {roles.map((role) => (
                        <option
                            key={role.value}
                            value={role.value}
                        >
                            {role.label}
                        </option>
                    ))}
                </select>

                {errors.role && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.role}
                    </p>
                )}
            </div>            

            <div>
                <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium"
                >
                    Password
                </label>

                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) =>
                            setData('password', e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2 pr-10 text-sm font-medium"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((current) => !current)
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-700"
                        aria-label={
                            showPassword
                                ? 'Hide password'
                                : 'Show password'
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                    </p>
                )}
            </div>                

            <div>
                <label
                    htmlFor="password_confirmation"
                    className="mb-2 block text-sm font-medium"
                >
                    Confirm Password
                </label>

                <div className="relative">
                    <input
                        id="password_confirmation"
                        type={
                            showPasswordConfirmation
                                ? 'text'
                                : 'password'
                        }
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData(
                                'password_confirmation',
                                e.target.value
                            )
                        }
                        className="w-full rounded-md border px-3 py-2 pr-10 text-sm font-medium"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPasswordConfirmation(
                                (current) => !current
                            )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-700"
                        aria-label={
                            showPasswordConfirmation
                                ? 'Hide password confirmation'
                                : 'Show password confirmation'
                        }                        
                    >
                        {showPasswordConfirmation ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                </div>

                {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.password_confirmation}
                    </p>
                )}
            </div>            

            <div>
                <label
                    htmlFor="email_verified_at"
                    className="mb-2 block text-sm font-medium"
                >
                    Email Verified At
                </label>

                <input
                    type="checkbox"
                    id="email_verified_at"
                    checked={data.email_verified}
                    onChange={(e) =>
                        setData('email_verified', e.target.checked)
                    }
                    className="rounded border-gray-300"
                />

                {errors.email_verified && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.email_verified}
                    </p>
                )}                
            </div>

            <button
                type="submit"
                disabled={processing}
                className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {processing
                    ? 'Saving...'
                    : user
                        ? 'Update User'
                        : 'Create User'}
            </button>

            <button
                type="button"
                onClick={() => window.history.back()}
                className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 mx-2"
            >
                Cancel
            </button>
        </form>
    );
}