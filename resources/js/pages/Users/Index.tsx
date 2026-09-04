import { Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string|null;
    created_at: string;
    role: string;
    status: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Users {
    data: User[];
    links: PaginationLink[];
}

interface Filters {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface Props {
    users: Users;
    filters: Filters;
}

export default function Index({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [showColumnMenu, setShowColumnMenu] = useState(false);    
    const columnMenuRef = useRef<HTMLDivElement>(null);

    const handleSearch = (value: string) => {
        setSearch(value);

        router.get(
            '/users',
            { search: value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const deleteUser = (user: User) => {
        if (!confirm(`Delete ${user.name}?`)) {
            return;
        }

        router.delete(`/users/${user.id}`);
    };

    const sortBy = (column: string) => {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        router.get(
            '/users',
            {
                search: filters.search,
                sort: column,
                direction,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };
    
    const sortIndicator = (column: string) => {
        if (filters.sort !== column) {
            return '';
        }

        return filters.direction === 'asc'
            ? ' ↑'
            : ' ↓';
    };

    const columns = [
        { key: 'name', label: 'Name', hiddenByDefault: false },
        { key: 'email', label: 'Email', hiddenByDefault: false },
        { key: 'role', label: 'Role', hiddenByDefault: false },
        {
            key: 'email_verified_at',
            label: 'Email Verified',
            hiddenByDefault: true,
        },
        {
            key: 'created_at',
            label: 'Created',
            hiddenByDefault: true,
        },
        {
            key: 'status',
            label: 'Status',
            hiddenByDefault: true,
        },
    ] as const;

    const [visibleColumns, setVisibleColumns] = useState<
        Record<string, boolean>
    >(() => {
        const saved = localStorage.getItem('users-table-columns');

        if (saved) {
            return JSON.parse(saved);
        }

        return Object.fromEntries(
            columns.map((column) => [
                column.key,
                !column.hiddenByDefault,
            ])
        );
    });

    useEffect(() => {
        localStorage.setItem(
            'users-table-columns',
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                columnMenuRef.current &&
                !columnMenuRef.current.contains(event.target as Node)
            ) {
                setShowColumnMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    Users
                </h1>

                <Link
                    href="/users/create"
                    className="rounded bg-black px-4 py-2 text-white"
                >
                    Add User
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full rounded border px-4 py-2"
                />
            </div>

            <div className="mb-4 flex justify-end">
                <div className="relative" ref={columnMenuRef}>
                    <button
                        type="button"
                        onClick={() => setShowColumnMenu((current) => !current)}
                        className="rounded border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Columns
                    </button>

                    {showColumnMenu && (
                        <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border bg-white p-3 shadow-lg">
                            {columns.map((column) => (
                                <label
                                    key={column.key}
                                    className="flex cursor-pointer items-center gap-2 py-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns[column.key]}
                                        onChange={() =>
                                            setVisibleColumns((current) => ({
                                                ...current,
                                                [column.key]:
                                                    !current[column.key],
                                            }))
                                        }
                                    />

                                    <span>{column.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            {visibleColumns.name && (
                            <th
                                className="cursor-pointer px-4 py-3 text-left hover:bg-gray-100"
                                onClick={() => sortBy('name')}
                            >
                                Name{sortIndicator('name')}
                            </th>       
                            )}  
                            {visibleColumns.email && (        
                            <th
                                className="cursor-pointer px-4 py-3 text-left hover:bg-gray-100"
                                onClick={() => sortBy('email')}
                            >
                                Email{sortIndicator('email')}
                            </th>
                            )}
                            {visibleColumns.email_verified_at && (
                            <th
                                className="cursor-pointer px-4 py-3 text-left hover:bg-gray-100"
                                onClick={() => sortBy('email_verified_at')}
                            >
                                Email Verified{sortIndicator('email_verified_at')}
                            </th>
                            )}
                            {visibleColumns.created_at && (
                            <th className="px-4 py-3 text-left">
                                Created
                            </th>
                            )}
                            {visibleColumns.role && (
                            <th className="px-4 py-3 text-left">
                                Role
                            </th>
                            )}
                            {visibleColumns.status && (
                            <th className="px-4 py-3 text-left">
                                Status
                            </th>  
                            )}                                                   
                            <th className="px-4 py-3 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.data.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b"
                            >
                                {visibleColumns.name && (
                                <td className="px-4 py-3 text-sm font-medium">
                                    {user.name}
                                </td>
                                )}

                                {visibleColumns.email && (
                                <td className="px-4 py-3 text-sm font-medium">
                                    {user.email}
                                </td>
                                )}

                                {visibleColumns.email_verified_at && (
                                <td className="px-4 py-3 text-sm font-medium">
                                    {user.email_verified_at === null ? (
                                        <span className="text-red-600">Not Verified</span>
                                    ) : (
                                        <span className="text-green-600">Verified</span>
                                    )}
                                </td>
                                )}

                                {visibleColumns.created_at && (
                                <td className="px-4 py-3 text-sm font-medium">
                                    {user.created_at}
                                </td>
                                )}

                                {visibleColumns.role && (
                                <td className="px-4 py-3 text-sm font-medium">
                                    {user.role}
                                </td>
                                )}

                                {visibleColumns.status && (
                                <td className="px-4 py-3 text-sm font-medium">
                                    {user.status}
                                </td>
                                )}

                                <td className="px-4 py-3 text-right text-sm font-medium">                                  

                                    {user.email_verified_at === null && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        `Send a verification email to ${user.email}?`
                                                    )
                                                ) {
                                                    router.post(
                                                        `/users/${user.id}/verify-email`
                                                    );
                                                }
                                            }}
                                            className="text-green-600 mr-3 hover:underline"
                                        >
                                            Send Verification
                                        </button>
                                    )}

                                    <Link
                                        href={`/users/${user.id}`}
                                        className="mr-3"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/users/${user.id}/edit`}
                                        className="mr-3"
                                    >
                                        Edit
                                    </Link>
                                        
                                    <button
                                        onClick={() =>
                                            deleteUser(user)
                                        }
                                        className="text-red-600"
                                    >
                                        Delete
                                    </button>
                                      
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex gap-2">
                {users.links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url ?? '#'}
                        className={`rounded border px-3 py-1 ${
                            link.active
                                ? 'bg-black text-white'
                                : ''
                        }`}
                        dangerouslySetInnerHTML={{
                            __html: link.label,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}