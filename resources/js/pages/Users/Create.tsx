import UserForm from '@/components/users/UserForm';

interface Role {
    value: string;
    label: string;
}

interface Props {
    roles: Role[];
}

export default function Create({ roles }: Props) {
    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold">
                Create User
            </h1>

            <UserForm
                submitUrl="/users"
                roles={roles}
            />
        </div>
    );
}