import BrandPanel from '../components/BrandPanel';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <main className="w-screen min-h-screen m-0 p-0 overflow-x-hidden flex flex-col md:flex-row bg-white">
      <section className="hidden md:flex md:w-1/2 min-h-screen flex-col justify-between">
        <BrandPanel variant="login" />
      </section>

      <section className="w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center bg-white">
        <LoginForm />
      </section>
    </main>
  );
};

export default Login;