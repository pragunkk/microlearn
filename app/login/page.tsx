import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex justify-center pt-20">
      <SignIn />
    </div>
  );
}
