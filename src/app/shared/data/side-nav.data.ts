import { SideNavItems, SideNavSection } from "../models/navigation.model";


export const sideNavSections: SideNavSection[] = [
    {
        text: 'Anasayfa',
        items: ['dashboard'],
    },
    {
        text: 'User',
        items: ['userList'],
    },
    {
        text: 'Kategori',
        items: ['categoryList'],
    },
    {
        text: 'Yetki',
        items: ['permissionList','permissionGroupList'],
    },
    {
        text: 'Doküman',
        items: ['userDocumentList'],
    }
];

export const sideNavItems: SideNavItems = {
    dashboard: {
        icon: 'tachometer-alt',
        text: 'Anasayfa',
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
};
