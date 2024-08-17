import { useUpdate } from "@/hooks/useUpdate.hook";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

type UpdateUserComponent = {
  user: User;
};

function UpdateUserComponent({ user }: UpdateUserComponent) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
  } = useForm<User>({
    mode: "all",
  });

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  const queryClient = useQueryClient();
  const update_user = useUpdate<User>("/api/users/update", () => {
    alert("Utilisateur modifié avec succès");
    reset();
    queryClient.invalidateQueries({ queryKey: ["users"] });
  });
  const onSubmit = (data: User) => {
    update_user.handleUpdate(data);
    console.log(data);
    // Ici, vous pouvez gérer l'envoi des données au serveur
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Modifification d'utilisateur
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Nom</label>
          <input
            {...register("name", { required: "Nom est requis" })}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Prénom</label>
          <input
            {...register("firstname", { required: "Prénom est requis" })}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstname.message}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Adresse</label>
          <input
            {...register("address", { required: "Adresse est requise" })}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Téléphone</label>
          <input
            {...register("phone", {
              required: "Téléphone est requis",
              maxLength: {
                value: 12,
                message:
                  "Le numéro de téléphone doit comporter au maximum 12 caractères",
              },
            })}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Rôle</label>
          <input
            {...register("role", { required: "Rôle est requis" })}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Email</label>
          <input
            {...register("email", {
              required: "Email est requis",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Email invalide",
              },
            })}
            type="email"
            className="p-2 border border-gray-300 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Mot de passe</label>
          <input
            {...register("password", { required: "Mot de passe est requis" })}
            type="password"
            className="p-2 border border-gray-300 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateUserComponent;
