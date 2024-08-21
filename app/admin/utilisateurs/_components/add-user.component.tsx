import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreate } from "@/hooks/useCreate.hook";
import { User as PrismaUser } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CirclePlus, Eye, EyeOff } from "lucide-react";
import { showToast } from "@/lib/showSwal";
import InputError from "@/components/ui/input-error";

type User = PrismaUser & {
  confirm_password: string;
};

function AddUserComponent() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
  } = useForm<User>({
    mode: "all",
  });

  const queryClient = useQueryClient();
  const create_user = useCreate<User>("/api/users/create", () => {
    showToast(
      "Information",
      "L'information de l'utilisateur a été créé avec succès",
      "success"
    );
    setIsAddOpen(false);
    queryClient.invalidateQueries({ queryKey: ["users"] });
  });
  const onSubmit = async (data: User) => {
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
      data.profile = result.profileFileName || "";
    }
    data.profile = "";
    await create_user.handleAdd(data);
  };

  //L'état du modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Pour afficher/masquer le mot de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm_password, setShowConfirm_password] = useState(false);

  const password = watch("password");

  useEffect(() => {
    reset();
  }, [isAddOpen, setIsAddOpen]);

  return (
    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
      <Button onClick={() => setIsAddOpen(true)}>
        <CirclePlus className="h-5 w-5 mr-2" /> Ajouter un nouvel utilisateur
      </Button>

      <DialogContent className="max-h-[80vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Ajout de nouvel utilisateur</DialogTitle>
          {/* <DialogDescription>
            Formulaire pour ajouter de nouvel utilisateur
          </DialogDescription> */}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Profile */}
            <div className="grid grid-cols-4 items-center justify-start gap-1">
              <Label htmlFor="profile" className="text-left">
                Profile
              </Label>
              <Input
                {...register("profile")}
                className="col-span-3 "
                type="file"
              />
            </div>

            {/* Nom */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="name" className="text-left">
                Nom
              </Label>
              <Input
                {...register("name", {
                  required: "Nom est requis",
                })}
                className={`col-span-3 ${errors.name ? "border-red-600" : ""}`}
              />
              {errors.name && (
                <InputError
                  message={errors.name?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>

            {/* Prénom */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="firstname" className="text-left">
                Prénom(s)
              </Label>
              <Input
                {...register("firstname", { required: "Prénom est requis" })}
                className={`col-span-3 ${
                  errors.firstname ? "border-red-600" : ""
                }`}
              />
              {errors.firstname && (
                <InputError
                  message={errors.firstname?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="address" className="text-left">
                Adresse
              </Label>
              <Input
                {...register("address", { required: "Adresse est requise" })}
                className={`col-span-3 ${
                  errors.address ? "border-red-600" : ""
                }`}
              />
              {errors.address && (
                <InputError
                  message={errors.address?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>

            {/* Téléphone */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="address" className="text-left">
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
                <InputError
                  message={errors.phone?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>

            {/* Rôle */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="role" className="text-left">
                Rôle
              </Label>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Rôle est requis" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3 border border-input bg-primary rounded-full px-4 py-2">
                      <SelectValue placeholder="Sélectionnez le rôle de l'utilisateur" />
                    </SelectTrigger>
                    <SelectContent
                      className={`col-span-3 ${
                        errors.role ? "border-red-600" : ""
                      }`}
                    >
                      <SelectGroup>
                        <SelectLabel>Rôle de l'utilisateur</SelectLabel>
                        <SelectItem value="Administrateur">
                          Administrateur
                        </SelectItem>
                        <SelectItem value="Adhérent">Adhérent</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <InputError
                  message={errors.role?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-1">
              <Label htmlFor="email" className="text-left">
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
                <InputError
                  message={errors.email?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>

            {/* Mot de passe */}
            <div className="grid grid-cols-4 items-center gap-1 relative">
              <Label htmlFor="password" className="text-left">
                Mot de passe
              </Label>
              <div className="col-span-3 relative">
                <Input
                  {...register("password", {
                    required: "Mot de passe est requis",
                    minLength: {
                      value: 8,
                      message:
                        "Le mot de passe doit comporter au moins 08 caractères",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`w-full ${
                    errors.password ? "border-red-600" : ""
                  }`}
                />
                <Button
                  type="button"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              {errors.password && (
                <InputError
                  message={errors.password?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>

            {/* Confirmation Mot de passe */}
            <div className="grid grid-cols-4 items-center gap-1 relative">
              <Label htmlFor="confirm_password" className="text-left">
                Confirmation Mot de passe
              </Label>
              <div className="col-span-3 relative">
                <Input
                  {...register("confirm_password", {
                    required: "Confirmation de mot de passe est requise",
                    validate: (value) =>
                      value === password ||
                      "Les mots de passe ne correspondent pas",
                  })}
                  type={showConfirm_password ? "text" : "password"}
                  className={`w-full ${
                    errors.confirm_password ? "border-red-600" : ""
                  }`}
                />
                <Button
                  type="button"
                  className="absolute right-0 top-0"
                  onClick={() => setShowConfirm_password(!showConfirm_password)}
                  variant="ghost"
                >
                  {showConfirm_password ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              {errors.confirm_password && (
                <InputError
                  message={errors.confirm_password?.message}
                  classname="col-start-2 col-span-3 pl-2"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="no-bg-destructive"
              onClick={() => {
                setIsAddOpen(false);
              }}
              className="hover:bg-red-100 rounded-full"
            >
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserComponent;
