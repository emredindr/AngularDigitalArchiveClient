import { SideNavItems, SideNavSection } from "../models/navigation.model";


export const sideNavSections: SideNavSection[] = [
    {
        text: 'CORE',
        items: ['dashboard','categoryList','userList','permissionList','permissionGroupList','userDocumentList'],
    },
    {
        text: 'INTERFACE',
        items: ['layouts', 'pages'],
    },
    {
        text: 'ADDONS',
        items: ['charts', 'tables'],
    },
];

export const sideNavItems: SideNavItems = {
    dashboard: {
        icon: 'tachometer-alt',
        text: 'Dashboard',
        link: '/main/home/dashboard',
    },
    categoryList: {
        icon: 'tachometer-alt',
        text: 'Kategori Listesi',
        link: '/main/category/list',
    },
    userList: {
        icon: 'tachometer-alt',
        text: 'Kullanıcı Listesi',
        link: '/admin/user/list',
    },
    permissionList:{
        icon: 'tachometer-alt',
        text: 'Yetki Listesi',
        link: '/admin/permission/list',
    },
    permissionGroupList:{
        icon: 'tachometer-alt',
        text: 'Yetki Grup Listesi',
        link: '/admin/permission-group/list',
    },
    userDocumentList:{
        icon: 'tachometer-alt',
        text: 'Kullanıcı Belge Listesi',
        link: '/main/user-document/list',
    }
    ,
    layouts: {
        icon: 'columns',
        text: 'Layouts',
        submenu: [
            {
                text: 'Static Navigation',
                link: '/dashboard/static',
            },
            {
                text: 'Light Sidenav',
                link: '/dashboard/light',
            },
        ],
    },
    pages: {
        icon: 'book-open',
        text: 'Pages',
        submenu: [
            {
                text: 'Authentication',
                submenu: [
                    {
                        text: 'Login',
                        link: '/auth/login',
                    },
                    {
                        text: 'Register',
                        link: '/auth/register',
                    },
                    {
                        text: 'Forgot Password',
                        link: '/auth/forgot-password',
                    },
                ],
            },
            {
                text: 'Error',
                submenu: [
                    {
                        text: '401 Page',
                        link: '/error/401',
                    },
                    {
                        text: '404 Page',
                        link: '/error/404',
                    },
                    {
                        text: '500 Page',
                        link: '/error/500',
                    },
                ],
            },
        ],
    },
    charts: {
        icon: 'chart-area',
        text: 'Charts',
        link: '/charts',
    },
    tables: {
        icon: 'table',
        text: 'Tables',
        link: '/tables',
    },
};
