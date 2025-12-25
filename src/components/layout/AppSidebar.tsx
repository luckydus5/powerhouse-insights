import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Shield, 
  ShoppingCart, 
  Settings as SettingsIcon, 
  Users, 
  Monitor, 
  Headphones, 
  Wrench,
  Bell,
  LogOut,
  ChevronDown,
  Building2,
  Zap,
  UserCog
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useDepartments } from '@/hooks/useDepartments';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Truck } from 'lucide-react';

const departmentIcons: Record<string, typeof DollarSign> = {
  'FIN': DollarSign,
  'SAF': Shield,
  'PRO': ShoppingCart,
  'OPS': SettingsIcon,
  'HR': Users,
  'IT': Monitor,
  'CS': Headphones,
  'ENG': Wrench,
  'PEAT': Truck,
};

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { signOut } = useAuth();
  const { profile, highestRole } = useUserRole();
  const { departments } = useDepartments();

  const mainNavItems = [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'My Reports', url: '/reports', icon: FileText },
    { title: 'Notifications', url: '/notifications', icon: Bell },
    ...(highestRole === 'admin' ? [{ title: 'User Management', url: '/admin', icon: UserCog }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;
  const isDepartmentActive = departments.some(d => location.pathname.includes(`/department/${d.code.toLowerCase()}`));

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">HQ Power</span>
              <span className="text-xs text-sidebar-foreground/60">Enterprise Dashboard</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Departments */}
        <SidebarGroup>
          <Collapsible defaultOpen={isDepartmentActive} className="group/collapsible">
            <SidebarGroupLabel asChild className="text-sidebar-foreground/50 uppercase text-xs tracking-wider">
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {!collapsed && <span>Departments</span>}
                </div>
                {!collapsed && (
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {departments.map((dept) => {
                    const Icon = departmentIcons[dept.code] || FileText;
                    const url = `/department/${dept.code.toLowerCase()}`;
                    return (
                      <SidebarMenuItem key={dept.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(url)}
                          tooltip={collapsed ? dept.name : undefined}
                        >
                          <NavLink to={url} className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            {!collapsed && <span>{dept.name}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {highestRole}
              </p>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={signOut}
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
