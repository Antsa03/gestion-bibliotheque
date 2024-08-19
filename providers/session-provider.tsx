"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

type SessionProviderComponentProps = {
  children: React.ReactNode;
};

function SessionProviderComponent({ children }: SessionProviderComponentProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default SessionProviderComponent;
