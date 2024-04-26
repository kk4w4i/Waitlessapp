import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '../assets/waitless-logo.webp';
import Cookies from 'universal-cookie'


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Signin () {
    const cookies = new Cookies();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
      
        try {
          const response = await fetch("/api/login/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": cookies.get("csrftoken"),
            },
            credentials: "same-origin",
            body: JSON.stringify({ username: email, password: password }),
          });
      
          if (!response.ok) {
            throw new Error("Login failed");
          }
      
          const data = await response.json();
          console.log(data);
          window.location.href = '/menu'
      
          // Store the access token in local storage
          localStorage.setItem("access-token", data.access_token);
      
          // Handle successful login, e.g., redirect to a protected page
        } catch (error) {
          console.error("Login error:", error);
          // Handle login error, e.g., display an error message
        }
      };

  return (
    <div>
        <button onClick={() => window.location.href = '/'}>
            <img className='fixed bottom-10 h-[30px] left-1/2 -translate-x-1/2' src={Logo}></img>
        </button>
        <Card className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 mx-auto w-[80vw] md:w-[30vw] border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link to="#" className="ml-auto inline-block text-sm underline">
                            Forgot your password?
                        </Link>
                        </div>
                        <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full rounded-md">
                        Login
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
    
  )
}

export default Signin
