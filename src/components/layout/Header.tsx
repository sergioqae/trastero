
"use client";
import { Package2 } from 'lucide-react';
import Link from 'next/link';
// import { Button } from "@/components/ui/button";
// import type { User } from "firebase/auth"; // Firebase User type no longer needed

// interface HeaderProps { // Props related to Firebase auth no longer needed
//   currentUser: User | null;
//   loadingAuth: boolean;
//   handleSignIn: () => void;
//   handleSignOut: () => void;
// }

export function Header(/*{ currentUser, loadingAuth, handleSignIn, handleSignOut }: HeaderProps*/) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package2 className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            Gestor de Trasteros
          </span>
        </Link>
        {/* Firebase Auth related UI removed */}
        {/* <div className="flex items-center space-x-2">
          {loadingAuth ? (
            <Button variant="outline" size="sm" disabled>Cargando...</Button>
          ) : currentUser ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                <UserCircle className="inline-block mr-1 h-4 w-4 align-middle" />
                {currentUser.displayName || currentUser.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleSignIn}>
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesión con Google
            </Button>
          )}
        </div> */}
      </div>
    </header>
  );
}
