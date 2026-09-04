import { Link, usePage } from '@inertiajs/react';
import { Users, CircleUser, Files } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const navItemsForCandidates: NavItem[] = [
    {
        title: 'My Resume',
        href: '/myresume',
        icon: Files,
    },
];

const navItemsForAdmins: NavItem[] = [
    {
        title: 'Candidates',
        href: '/candidates',
        icon: CircleUser,
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
];

const navItemsForSuperAdmin: NavItem[] = [
];

const footerNavItems: NavItem[] = [
];

export function AppSidebar() {
    const { auth } = usePage().props;
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {auth.user && auth.user.role == "candidate" && (
                <>
                <NavMain items={navItemsForCandidates} />
                </>
                )}

                {auth.user && auth.user.role == "admin" && (
                <>
                <NavMain items={navItemsForAdmins} />
                </>
                )}

                {auth.user && auth.user.role == "superadmin" && (
                <>
                <NavMain items={navItemsForAdmins} />
                <NavMain items={navItemsForSuperAdmin} />
                </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
