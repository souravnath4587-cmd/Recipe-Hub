import SignInPage from "./SignInForm";

const page = async ({ searchParams }) => {
  const params = await searchParams;
  console.log(params);

  const redirectTo = params?.redirect || "/";
  console.log(redirectTo);

  return (
    <div>
      <SignInPage redirectTo={redirectTo} />
    </div>
  );
};

export default page;
