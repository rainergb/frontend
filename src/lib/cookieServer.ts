import { cookies } from "next/headers";

export function getCookiServer(){
    const token = cookies().get("session")?.value;

    return token || null;
}