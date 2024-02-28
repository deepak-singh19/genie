"use client"

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { navLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
  

const MobileNav = () => {

    const pathname= usePathname();
  return (
    <header className='header'>
        <Link href="/" className="flex items-center gap-2 md:py-2">
            <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28}/>
        </Link>

        <nav className='flex gap-2'>
            <SignedIn>
                <UserButton afterSignOutUrl='/sign-in'/>

                <Sheet>
                    <SheetTrigger>
                        <Image src="/assets/icons/menu.svg" alt={''} width={32} height={32} className='cursor-pointer'/>
                    </SheetTrigger>
                    <SheetContent className='sheet-content'>
                        <>
                        <Image src="assets/images/logo-text.svg" alt="logo" width={152} height={23}/>
                        <ul className='header-nav_elements'>
                        {navLinks.slice(0,6).map((link)=>{
                            const isActive= link.route === pathname

                            return(
                                <li key={link.route} className={`whitespace-nowrap text-dark-700 p-18 flex ${isActive && "gradient-text"}`}>
                                    <Link className='sidebar-link cursor-pointer' href={link.route}>
                                        <Image src={link.icon} alt="logo" width={24} height={24} className={``}/>
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        })}

                    </ul>
                        </>
                    </SheetContent>
                </Sheet>

            </SignedIn>

            <SignedOut>
                    <Button asChild className='button bg-purple-gradient bg-cover'>
                        <Link href="/sign-in">Login</Link>
                    </Button>
                </SignedOut>
        </nav>

    </header>
  )
}

export default MobileNav

///Users/deepaksingh/Desktop/SaaS/geinie/public/assets/icons/menu.svg