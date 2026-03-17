import LoginForm from "@/components/LoginForm";
import Dashboard from "../dashboard/page";
export default function LoginPage() {
  return (
    <div>
      <LoginForm />
      <Dashboard to='/dashboard'/>
    </div>
  );
}