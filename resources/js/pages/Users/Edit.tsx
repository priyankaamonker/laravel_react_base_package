import UserForm from '@/components/users/UserForm';

interface Role {
    value: string;
    label: string;
}

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
    roles: Role[];
}

export default function Edit({
    user,
    roles,
}: Props) {
    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold">
                Edit User
            </h1>

            <UserForm
                user={user}
                roles={roles}
                submitUrl={`/users/${user.id}`}
                method="put"
            />
        </div>
    );
}