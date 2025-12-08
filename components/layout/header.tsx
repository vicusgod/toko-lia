"use client"

import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { MobileNav } from "@/components/layout/mobile-nav"

export function Header() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
            <MobileNav />
            <div className="flex-1">
                {/* Add search or breadcrumbs here if needed */}
            </div>
            <div className="flex items-center gap-4">
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />
            </div>
        </header>
    )
}
