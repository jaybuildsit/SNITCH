import BrandPanel from '../components/BrandPanel';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <main className="w-screen min-h-screen m-0 p-0 overflow-x-hidden flex flex-col lg:flex-row bg-white">
      {/* LEFT 50% BRANDING PANEL */}
      <section className="w-full lg:w-1/2 min-h-[auto] lg:min-h-screen flex flex-col justify-between">
        <BrandPanel />
      </section>

      {/* RIGHT 50% REGISTRATION PANEL */}
      <section className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center bg-white">
        <RegisterForm />
      </section>
    </main>
  );
};

export default Register;