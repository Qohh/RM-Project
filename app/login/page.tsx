
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center p-4">
          <Image
            src="/logo-rm.png"
            alt="Logo Organisasi"
            width={60}
            height={60}
          />
        </div>
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Login Anggota RM
            </CardTitle>
            <CardDescription className="pt-2">
              Masuk Sebagai Anggota <br></br>Remaja Mujahidin Kalimantan Barat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Remaja Mujahidin Kalimantan Barat.
      </footer>
    </main>
  );
}
