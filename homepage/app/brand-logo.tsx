import Image from "next/image";
import { homeAssets } from "./site";

/** The site mark, shipped in both the documentation header and this masthead. */
export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return <Image src={`${homeAssets}/brand/logo.svg`} alt="" width={44} height={38} priority={priority} />;
}
