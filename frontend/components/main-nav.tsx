import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface MainNavProps {
  items?: NavItem[];
}

interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
}

export function MainNav({ items }: MainNavProps) {
  const org_name = "Tim Morehouse Fencing Club";
  const org_logo =
    "https://ofxtxvtdaaypupsvigri.supabase.co/storage/v1/object/public/public/company/logo-image.png";

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        {org_logo ? (
          <Image src={org_logo} width={200} height={100} alt={org_name} />
        ) : (
          <span className="inline-block font-bold">{org_name}</span>
        )}
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}
