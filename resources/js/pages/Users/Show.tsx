import { Link } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string|null;
    created_at: string;
    role: string;
    status: string;
}

interface Props {
    user: User;
}

export default function Show({ user }: Props) {
    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between">
                <h1 className="text-2xl font-semibold">
                    User Details
                </h1>
            </div>

            <div className="max-w-xl space-y-4 rounded border p-6 text-sm font-medium">
                <div>
                    <strong>Name:</strong>
                    <div>{user.name}</div>
                </div>

                <div>
                    <strong>Email:</strong>
                    <div>{user.email}</div>
                </div>

                <div>
                    <strong>Email Verified At:</strong>
                    <div>{user.email_verified_at}</div>
                </div>

                <div>
                    <strong>Created:</strong>
                    <div>{user.created_at}</div>
                </div>

                <div>
                    <strong>Role:</strong>
                    <div>{user.role}</div>
                </div>

                <div>
                    <strong>Status:</strong>
                    <div>{user.status}</div>
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                <Link
                    href={`/users/${user.id}/edit`}
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    Edit
                </Link>

                <Link
                    href={`/users`}
                    className="rounded bg-gray-200 px-4 py-2 text-gray-800"
                >
                    Back
                </Link>
            </div>
        </div>
    );
}