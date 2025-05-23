import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { USER_API_END_POINT } from "../../utils/constant";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student", // Default role selection
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // React Router navigation

  // Handle input changes
  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post(`${USER_API_END_POINT}/login`, input, {
        withCredentials: true,
      });

      setMessage(response.data.message); // Show success message

      if (response.data.success) {
        navigate("/"); // Redirect to home page after successful login
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Redirect to signup page
  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg">
        {/* Header */}
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-[#6A38C2]">
            Login to Your Account
          </h2>
          <p className="text-center text-gray-500">
            Enter your credentials to continue
          </p>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <Label className="text-gray-700">Email</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <Label className="text-gray-700">Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>

        {/* Role Selection */}
        <CardContent>
          <Label className="text-gray-700">Login as</Label>
          <RadioGroup
            value={input.role}
            onValueChange={(role) => setInput({ ...input, role })}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student" className="cursor-pointer">
                Student
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="recruiter" id="recruiter" />
              <Label htmlFor="recruiter" className="cursor-pointer">
                Recruiter
              </Label>
            </div>
          </RadioGroup>
        </CardContent>

        {/* Buttons */}
        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#F97316] hover:bg-[#d55e0b] text-white font-medium"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-[#6A38C2] cursor-pointer hover:underline"
              onClick={handleSignupRedirect}
            >
              Sign up
            </span>
          </p>
          {message && (
            <p className="text-center text-sm text-red-600">{message}</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
