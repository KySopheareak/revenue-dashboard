import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/dashboard',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 'features',
    subheader: 'Features',
    path: '/features',
    icon: 'mingcute:star-fill',
    active: true,
  },
  {
    id: 'users',
    subheader: 'Users',
    path: '/users',
    icon: 'mingcute:user-2-fill',
    active: true,
  },
  {
    id: 'pricing',
    subheader: 'Pricing',
    path: '/pricing',
    icon: 'mingcute:currency-dollar-2-line',
    active: true,
  },
  {
    id: 'integrations',
    subheader: 'Integrations',
    path: '/integrations',
    icon: 'mingcute:plugin-2-fill',
    active: true,
  },
  {
    id: 'authentication',
    subheader: 'Authentication',
    icon: 'mingcute:safe-lock-fill',
    items: [
      {
        name: 'Login',
        pathName: 'login',
        path: paths.login,
      },
      {
        name: 'Signup',
        pathName: 'signup',
        path: paths.signup,
      },
    ],
  },
  {
    id: 'settings',
    subheader: 'Settings',
    path: '/settings',
    icon: 'material-symbols:settings-rounded',
    active: true,
  },
  {
    id: 'account-settings',
    subheader: 'Admin 168',
    path: '/account-settings',
    active: true,
  },
];

export default sitemap;
