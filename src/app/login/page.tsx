import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="flex flex-col w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-4">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          className="border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your email"
          className="border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
        />
        <div className="flex gap-3">
          <button
            formAction={login}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            Log in
          </button>
          <button
            formAction={signup}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
