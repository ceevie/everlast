   "use client";

   import Link from "next/link";
   import { usePathname } from "next/navigation";
   import { mainNav } from "@/config/navigation";
   import { cn } from "@/lib/utils";
   import { ScrollArea } from "@/components/ui/scroll-area";
   import { Separator } from "@/components/ui/separator";
   import {
     Users,
     CheckSquare,
     Workflow,
     Settings
   } from "lucide-react";

   const iconMap = {
     users: Users,
     "check-square": CheckSquare,
     workflow: Workflow
   };

   export function Sidebar() {
     const pathname = usePathname();

     return (
       <aside className="flex h-screen w-64 flex-col border-r bg-background">
         <div className="flex h-16 items-center px-4">
           <span className="text-lg font-semibold">Everlast CRM</span>
         </div>
         <Separator />
         <ScrollArea className="flex-1 px-2 py-4">
           <nav className="space-y-1">
             {mainNav.map((item) => {
               const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Settings;
               const active = pathname.startsWith(item.href);
               return (
                 <Link
                   key={item.href}
                   href={item.href}
                   className={cn(
                     "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                     active
                       ? "bg-primary/10 text-primary"
                       : "text-muted-foreground hover:bg-muted"
                   )}
                 >
                   <Icon className="h-4 w-4" />
                   {item.label}
                 </Link>
               );
             })}
           </nav>
         </ScrollArea>
       </aside>
     );
   }