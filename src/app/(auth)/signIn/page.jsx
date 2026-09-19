import SignInPage from "./SignInForm";

const page = async ({ searchParams }) => {
  const params = await searchParams;

  const redirectTo = params?.redirect || "/";

  return (
    <div>
      <SignInPage redirectTo={redirectTo} />
    </div>
  );
};

export default page;
