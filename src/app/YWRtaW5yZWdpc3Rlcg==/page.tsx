'use client'
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false); // Track if this user is admin
    const [error, setError] = useState<{ [key: string]: string } | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const validateInputs = (): boolean => {
        const newError: { [key: string]: string } = {};

        if (!name.trim()) {
            newError.name = "Name is required.";
        }

        if (!email.trim()) {
            newError.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newError.email = "Please enter a valid email.";
        }

        if (!password.trim()) {
            newError.password = "Password is required.";
        } else if (password.length < 6) {
            newError.password = "Password must be at least 6 characters.";
        }

        if (password !== confirmPassword) {
            newError.confirmPassword = "Passwords do not match.";
        }

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return false;
        }

        setError(null);
        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        setIsSubmitting(true);
        setServerError(null); 
        try {
            const response = await fetch("/api/auth/adminreg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword,
                    isAdmin, 
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Registration successful:", result);
                alert("User registered successfully!");

               
                router.push("/login");
            } else {
                console.error("Registration failed:", result);
                setServerError(result.error || "An error occurred during registration.");
            }
        } catch (err) {
            console.error("Error during registration:", err);
            setServerError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

       
                {serverError && (
                    <div className="text-red-500 text-sm mb-4 text-center font-medium">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your name"
                        />
                        {error?.name && (
                            <div className="text-red-500 text-sm mt-1">{error.name}</div>
                        )}
                    </div>

                  
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                        {error?.email && (
                            <div className="text-red-500 text-sm mt-1">{error.email}</div>
                        )}
                    </div>

                  
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                        {error?.password && (
                            <div className="text-red-500 text-sm mt-1">{error.password}</div>
                        )}
                    </div>

                  
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm your password"
                        />
                        {error?.confirmPassword && (
                            <div className="text-red-500 text-sm mt-1">{error.confirmPassword}</div>
                        )}
                    </div>

                  
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isAdmin"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="isAdmin" className="text-gray-700">
                            Register as Admin
                        </label>
                    </div>

                  
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
