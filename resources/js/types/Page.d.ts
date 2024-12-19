import type { Page, PageProps, Errors, ErrorBag } from "@inertiajs/core";

export interface ContentProps {
    title: string;
    url: string | null;
    description: string | null;
    icon: string | null;
    parent_id: string | null;
}

declare global {
    interface InertiaProps extends Page<PageProps> {
        errors: Errors & ErrorBag;
        siteTitle: string;
        sidebarLinks: SidebarLinkProps[];
        topMenuLinks: TopMenuLinkProps[];
        [key: string]: any;
    }
}
