import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdate } from "@/hooks/useUpdate.hook";
import { showToast } from "@/lib/showSwal";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";

type UpdateModalUserAccountProps = {
  user: User;
  isUpdateAccountOpen: boolean;
  setIsUpdateAccountOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UpdateModalUserAccount({
  user,
  isUpdateAccountOpen,
  setIsUpdateAccountOpen,
}: UpdateModalUserAccountProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    mode: "all",
  });

  const queryClient = useQueryClient();
  const update_user = useUpdate<User>("/api/account-update", () => {
    showToast(
      "Information",
      "L'information de l'utilisateur a été modifié avec succès",
      "success"
    );
    setIsUpdateAccountOpen(false);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  });
  const handleSubmitUser = async (data: User) => {
    const formData = new FormData();
    let shouldUpload = false;

    if (data.profile && (data.profile as unknown as FileList).length > 0) {
      formData.append("profile", (data.profile as unknown as FileList)[0]);
      shouldUpload = true;
    }

    if (shouldUpload) {
      const response = await fetch("/api/upload/profile", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      data.profile = result.profileFileName || data.profile;
    } else {
      data.profile = user.profile;
    }
    await update_user.handleUpdate(data);
  };

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  return (
    <Dialog open={isUpdateAccountOpen} onOpenChange={setIsUpdateAccountOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Espace compte</DialogTitle>
          <DialogDescription>
            Formulaire pour modifier vos informations
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitUser)}>
          <div className="grid gap-4 py-4">
            {/* Profile */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="profile" className="text-center">
                Profile
              </Label>
              <Input
                {...register("profile")}
                className="col-span-3"
                type="file"
              />
            </div>
            {/* Nom */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="name" className="text-center">
                Nom
              </Label>
              <Input
                {...register("name", {
                  required: "Nom est requis",
                })}
                className={`col-span-3 ${errors.name ? "border-red-600" : ""}`}
              />
              {errors.name && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.name.message}
                </p>
              )}
            </div>
            {/* Prénom(s) */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="firstname" className="text-center">
                Prénom
              </Label>
              <Input
                {...register("firstname", { required: "Prénom est requis" })}
                className={`col-span-3 ${
                  errors.firstname ? "border-red-600" : ""
                }`}
              />
              {errors.firstname && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.firstname.message}
                </p>
              )}
            </div>
            {/* Adresse */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="address" className="text-center">
                Adresse
              </Label>
              <Input
                {...register("address", { required: "Adresse est requise" })}
                className={`col-span-3 ${
                  errors.address ? "border-red-600" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.address.message}
                </p>
              )}
            </div>
            {/* Téléphone */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="address" className="text-center">
                Téléphone
              </Label>
              <Input
                {...register("phone", {
                  required: "Téléphone est requis",
                  maxLength: {
                    value: 12,
                    message:
                      "Le numéro de téléphone doit comporter au maximum 12 caractères",
                  },
                })}
                className={`col-span-3 ${errors.phone ? "border-red-600" : ""}`}
              />
              {errors.phone && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.phone.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="email" className="text-center">
                Email
              </Label>
              <Input
                {...register("email", {
                  required: "Email est requis",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Email invalide",
                  },
                })}
                className={`col-span-3 ${errors.email ? "border-red-600" : ""}`}
              />
              {errors.email && (
                <p className="text-red-600 text-center col-span-4">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-[90px]">
              Ok
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsUpdateAccountOpen(false);
              }}
            >
              Annuler
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
