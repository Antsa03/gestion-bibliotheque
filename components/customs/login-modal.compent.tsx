"use client";
import React, { useEffect, useState } from "react";
import { ResponsiveDialog } from "../responsive-dialog";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";
import { DialogFooter } from "../ui/dialog";
import { signIn } from "next-auth/react";
import RegisterModal from "./register-modal.component";
import ResetPasswordComponent from "./reset-password.component";

type Login = {
  email: string;
  password: string;
};

function LoginModal() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const { register, reset, handleSubmit, control, getValues } = useForm<Login>({
    mode: "all",
  });

  const handleSubmitLogin: SubmitHandler<Login> = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        setIsLoginOpen(false);
        setErrorMessage("");
      } else if (res?.error) {
        setErrorMessage("Email ou mot de passe invalide");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
    if (resetPasswordError) {
      setResetPasswordError("");
    }
  };

  const openRegisterModal = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  // Logique du mot de passe oublié
  const email = getValues("email");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const handleForgotPassword = () => {
    const trimmedEmail = getValues("email")?.trim(); // Get the current value of email
    console.log(trimmedEmail);

    if (!trimmedEmail) {
      setResetPasswordError("Veuillez entrer l'email");
    } else {
      setShowResetPassword(true);
    }
  };

  useEffect(() => {
    if (!isLoginOpen) {
      reset();
      setShowResetPassword(false);
      setErrorMessage("");
      setResetPasswordError("");
    }
  }, [isLoginOpen, reset]);

  return (
    <>
      <Button onClick={() => setIsLoginOpen(true)}>Se connecter</Button>
      <ResponsiveDialog
        isOpen={isLoginOpen}
        setIsOpen={setIsLoginOpen}
        title="Authentification"
        description="Formulaire pour s'authentifier"
      >
        {showResetPassword ? (
          <ResetPasswordComponent
            email={getValues("email")} // Pass the email value directly
            setShowResetPassword={setShowResetPassword}
            reset={reset}
          />
        ) : (
          <form onSubmit={handleSubmit(handleSubmitLogin)}>
            <div className="grid gap-4 py-4">
              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-1">
                <Label htmlFor="email" className="text-center">
                  Email
                </Label>
                <Input
                  {...register("email", {
                    required: "L'email est requis",
                  })}
                  className="col-span-3"
                  onChange={handleInputChange}
                  placeholder="exemple@mail.com"
                />
              </div>
              {/* Mot de passe */}
              <div className="grid grid-cols-4 items-center gap-1 relative">
                <Label htmlFor="password" className="text-center">
                  Mot de passe
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    {...register("password", {
                      required: "Le mot de passe est requis",
                    })}
                    type={showPassword ? "text" : "password"}
                    className={`col-span-3`}
                    onChange={handleInputChange}
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
              </div>
            </div>
            {/* Affichage du message d'erreur */}
            {errorMessage && (
              <p className="text-red-500 text-center mb-3">{errorMessage}</p>
            )}
            {resetPasswordError && (
              <p className="text-red-500 text-center mb-3">
                {resetPasswordError}
              </p>
            )}
            <DialogFooter>
              <div className="w-full gap-4">
                <div className="w-full px-10 gap-1">
                  <Button
                    onClick={handleForgotPassword}
                    className="w-full bg-none text-blue-500"
                    variant="link"
                  >
                    Mot de passe oublié?
                  </Button>
                  <Button type="submit" className="w-full">
                    Se connecter
                  </Button>
                </div>
                <div className="w-full flex flex-col justify-center items-center pt-4">
                  <p>Vous n'avez pas de compte.</p>
                  <Button
                    onClick={openRegisterModal}
                    className="w-full bg-none text-blue-500"
                    variant="link"
                  >
                    S'inscrire maintenant
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        )}
      </ResponsiveDialog>
      <RegisterModal
        isRegisterOpen={isRegisterOpen}
        setIsRegisterOpen={setIsRegisterOpen}
      />
    </>
  );
}

export default LoginModal;
