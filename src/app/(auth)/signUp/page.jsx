import SignUpPage from "./SignUpForm";

const page = async ({ searchParams }) => {
  const params = await searchParams;
  const redirectTo = params?.redirect || "/";
  return (
    <div>
      <SignUpPage redirectTo={redirectTo} />
    </div>
  );
};

export default page;
