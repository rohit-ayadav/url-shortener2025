"use client";
import React, { useEffect } from 'react';
import { Link as LinkIcon, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { DialogTitle } from '@radix-ui/react-dialog';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isLoggedin, setIsLoggedin] = React.useState(false);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [avatar, setAvatar] = React.useState('');
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkSession = async (): Promise<void> => {
            const session = await getSession();
            if (session) {
                setIsLoggedin(true);
                setName(session.user?.name ?? '');
                setEmail(session.user?.email ?? '');
                setAvatar(session.user?.image ?? '');
            }
        };
        if (status !== 'loading') checkSession();
    }, [session, status]);

    const isAuthenticated = isLoggedin;
    const user = {
        name: name,
        email: email,
        avatar: avatar,
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b shadow-sm' : 'bg-white border-b'}`}>
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2" onClick={() => router.push('/')}>
                        <LinkIcon className="h-6 w-6 text-blue-600" />
                        <span className="text-xl font-bold hover:text-blue-600 cursor-pointer select-none">Rushort</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Button onClick={() => router.push('/features')}
                            variant="ghost">Features</Button>
                        <Button onClick={() => router.push('/pricing')}
                            variant="ghost">Pricing</Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-1">
                                    Tools
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => router.push('/bulk-shortener')}>Bulk Shortener</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/text-mode')}>Text Mode</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/my-urls')}>My Urls</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/my-purchase')}>My Purchase</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                    {/* Desktop Auth Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2" onClick={() => router.push('/settings')}>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{user.name[0]}{user.name[1].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name}</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem className="flex flex-col items-start"
                                        onClick={() => router.push('/dashboard')}>
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-sm text-gray-500">{user.email}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>Dashboard</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/my-urls')}>My Links</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/my-purchase')}>My Purchase</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/products')}>See Products</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" onClick={() => signOut()}>
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => router.push('/auth')}>Sign In</Button>
                                <Button onClick={() => router.push('/auth?signup')}>Sign Up</Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <VisuallyHidden>
                                <DialogTitle>Mobile Menu</DialogTitle>
                            </VisuallyHidden>
                            <div className="flex flex-col h-full">
                                <SheetClose asChild>
                                    {isAuthenticated && (
                                        <div className="flex items-center gap-3 pb-6 mb-6 border-b"
                                            onClick={() => router.push('/dashboard')}>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name[0]}{user.name[1].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    )}
                                </SheetClose>


                                <SheetClose asChild>
                                    <nav className="flex flex-col gap-2">
                                        <Button variant="ghost" className="justify-start" onClick={() => router.push('/features')}>
                                            Features
                                        </Button>
                                        <Button variant="ghost" className="justify-start" onClick={() => router.push('/pricing')}>
                                            Pricing
                                        </Button>
                                        <Button variant="ghost" className="justify-start" onClick={() => router.push('/bulk-shortener')}>
                                            Bulk Shortener
                                        </Button>
                                        <Button variant="ghost" className="justify-start" onClick={() => router.push('/text-mode')}>
                                            Text Mode
                                        </Button>
                                        <Button variant="ghost" className="justify-start" onClick={() => router.push('/my-purchase')}>
                                            My Purchase
                                        </Button>
                                        <Button variant="ghost" className="justify-start" onClick={() => router.push('/products')}>
                                            See Products
                                        </Button>
                                        <Button variant="ghost" className="justify-start" onClick={() => router.push('/my-urls')}>
                                            My Urls
                                        </Button>
                                        <Button variant="ghost" className="justify-start" onClick={() => router.push('/settings')}>
                                            Setting
                                        </Button>
                                    </nav>
                                </SheetClose>

                                <div className="mt-auto pt-6 border-t">
                                    <SheetClose asChild>
                                        {isAuthenticated ? (
                                            <Button variant="ghost" className="w-full justify-start text-red-600" onClick={() => signOut()}>
                                                Sign Out
                                            </Button>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <Button variant="outline" className="w-full" onClick={() => router.push('/auth')}>
                                                    Sign In
                                                </Button>
                                                <Button className="w-full" onClick={() => router.push('/auth?signup')}>
                                                    Sign Up
                                                </Button>
                                            </div>
                                        )}
                                    </SheetClose>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header >
    );
};

export default Header;