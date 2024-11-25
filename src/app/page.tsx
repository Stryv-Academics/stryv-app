import { logout } from "./actions";

export default async function HomePage() {
  return (
    <div className="flex flex-col gap-3 min-h-screen items-center justify-center bg-gray-100">
      <div className="block mx-auto mt-4 w-full max-w-md p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg shadow">
        <p className="text-sm md:text-base font-medium text-center">
          Welcome back! You’re successfully logged in.
        </p>
      </div>
      <form>
        <button
          formAction={logout}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 active:bg-red-700 transition duration-150"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
