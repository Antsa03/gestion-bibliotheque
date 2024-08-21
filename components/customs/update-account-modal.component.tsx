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
import ActionLoading from "../action-loading.component";
import { ResponsiveDialog } from "../responsive-dialog";
import { Mail, MapPin, Phone, User as UserIcon } from "lucide-react";

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
    <ResponsiveDialog
      isOpen={isUpdateAccountOpen}
      setIsOpen={setIsUpdateAccountOpen}
      title="Espace compte"
      description="Modifier vos informations"
    >
      {update_user.isUpdating ? (
        <ActionLoading text="En cours de modification" />
      ) : (
        <form onSubmit={handleSubmit(handleSubmitUser)} className="space-y-6">
          <div className="space-y-4">
            {/* Profile */}
            <div className="space-y-2">
              <Label htmlFor="profile" className="text-center">
                Profile
              </Label>
              <Input
                {...register("profile")}
                type="file"
                className="h-fit file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <div className="relative">
                  <UserIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("name", { required: "Nom requis" })}
                    className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                    placeholder="Votre nom"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              {/* Prénom(s) */}
              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom(s)</Label>
                <div className="relative">
                  <UserIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    {...register("firstname", { required: "Prénom requis" })}
                    className={`pl-10 ${
                      errors.firstname ? "border-red-500" : ""
                    }`}
                    placeholder="Votre prénom"
                  />
                </div>
                {errors.firstname && (
                  <p className="text-red-500 text-sm">
                    {errors.firstname.message}
                  </p>
                )}
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("address", { required: "Adresse requise" })}
                  className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
                  placeholder="Votre adresse"
                />
              </div>
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("phone", {
                    required: "Téléphone requis",
                    maxLength: { value: 12, message: "12 caractères maximum" },
                  })}
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="Votre numéro de téléphone"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  {...register("email", {
                    required: "Email requis",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Email invalide",
                    },
                  })}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="submit" className="min-w-[90px]">
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
      )}
    </ResponsiveDialog>
  );
}
