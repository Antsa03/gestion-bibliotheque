import { FigmaLogoIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function Footer() {
  return (
    <div className="z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-4 md:mx-8 flex h-14 items-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-center">
          <span className="flex items-center">
            Made with{" "}
            <HeartFilledIcon className="text-red-500 h-5 w-5 ml-2 mr-2" /> from
            Madagascar <FigmaLogoIcon className="text-green-500 h-5 w-5 mr-2" />
          </span>
        </p>
      </div>
    </div>
  );
}
