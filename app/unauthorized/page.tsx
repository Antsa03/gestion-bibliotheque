"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Vous n'êtes pas autorisé
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Désolé, vous n'avez pas les permissions nécessaires pour accéder à
          cette page.
        </p>
        <Button variant="default" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> Revenir en arrière
        </Button>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
