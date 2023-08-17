import { SignIn } from '@clerk/nextjs'

const SignInPage = () => (
  <div className="w-screen h-screen homeColor flex justify-center items-center">
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
)

export default SignInPage
