"use client";
import { api } from "@/services/api";
import { getCookie } from "cookies-next";
import Button from "../components/button";
import Input from "../components/input";
import { useRouter } from "next/navigation";

function isTokenExpired(token: string) {
  try {
    const decoded: any = jwt_decode(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("Erro ao decodificar o token:", err);
    return true;
  }
}

export default function Category() {
  const router = useRouter();

  async function handleRegisterCategory(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString();

    console.log("Nome obtido do formulário:", name);

    if (!name) {
      console.error("Nome não preenchido.");
      return;
    }

    const data = {
      name: name
    };

    const token = getCookie("token");

    console.log("Token obtido dos cookies:", token);

    if (!token) {
      console.error(
        "Token não encontrado. Certifique-se de que o usuário está autenticado e o token foi salvo corretamente nos cookies."
      );
      return;
    }

    if (isTokenExpired(token)) {
      console.error("Token expirado. O usuário precisa autenticar novamente.");
      return;
    }

    try {
      console.log("Dados a serem enviados:", data);
      console.log("Token utilizado na requisição:", `Bearer ${token}`);
      await api.post("/category", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Categoria registrada com sucesso");
      router.push("/dashboard");
    } catch (err) {
      console.error("Erro ao tentar registrar categoria:", err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-lg w-full max-w-[720px]">
        <h1 className="text-3xl font-bold text-white mb-6">Nova categoria</h1>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleRegisterCategory}
        >
          <Input
            name="name"
            placeholder="Digite o nome para categoria"
            required
          />
          <Button type="submit" name="Cadastrar">
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
}
function jwt_decode(token: string): any {
  throw new Error("Function not implemented.");
}
