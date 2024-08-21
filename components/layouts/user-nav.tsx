"use client";
import { LogOut, RectangleEllipsis, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { IMG_PROFILE_URL } from "@/constants/img-profile-url.constant";
import { signOut } from "next-auth/react";
import { useState } from "react";
import ChangePasswordModal from "@/components/customs/change-password-modal.component";
import UpdateModalUserAccount from "../customs/update-account-modal.component";
import { User as PrismaUser } from "@prisma/client";

export function UserNav() {
  const { data: session } = useSession();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  //L'état du modal compte
  const [isUpdateAccountOpen, setIsUpdateAccountOpen] = useState(false);

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={IMG_PROFILE_URL + session?.profile}
                    alt="Avatar"
                  />
                  <AvatarFallback className="bg-transparent">
                    {session?.name}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Modal pour changer de mot de passe */}
      <ChangePasswordModal
        isChangePasswordOpen={isChangePasswordOpen}
        setIsChangePasswordOpen={setIsChangePasswordOpen}
      />
      <UpdateModalUserAccount
        user={session as PrismaUser}
        isUpdateAccountOpen={isUpdateAccountOpen}
        setIsUpdateAccountOpen={setIsUpdateAccountOpen}
      />
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.name + " " + session?.firstname}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setIsChangePasswordOpen(true)}
          >
            <RectangleEllipsis className="w-4 h-4 mr-3 text-muted-foreground" />
            Changer le mot de passe
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer flex items-center"
            onClick={() => setIsUpdateAccountOpen(true)}
          >
            <User className="w-4 h-4 mr-3 text-muted-foreground" />
            Compte
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
