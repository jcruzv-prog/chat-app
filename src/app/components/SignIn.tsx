"use client";

//firebase
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";

//react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";

//font-awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const SignIn: React.FC = () => {
  const [user] = useAuthState(auth);
  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(`Error signing in with google: ${error}`);
    }
  };

  const handleSignOut = () => signOut(auth);
  return (
    <div className="flex flex-col items-center pt-4 gap-4">
      <h1 className="text-bold text-3xl">Chat-app</h1>
      <div className="flex flex-col items-center gap-5 border-blue-600 border-solid border p-5 w-[375px] bg-blue-200">
        <div className="flex items-center gap-2">
          <h2>Please sign in</h2>
          <FontAwesomeIcon icon={faLockOpen} className="text-2xl" />
        </div>
        <div className="flex flex-col gap-5 items-center">
          <button
            onClick={handleSignInWithGoogle}
            className="bg-blue-400 p-2 rounded-md flex gap-2 items-center"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-2xl" />
            Sign in with google
          </button>
          {user && (
            <button
              onClick={handleSignOut}
              className="bg-blue-400 p-2 rounded-md flex gap-2 items-center"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-2xl" />
              Sign out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
