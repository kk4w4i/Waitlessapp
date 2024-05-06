import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '../assets/waitless-logo.webp';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from '@/hooks/useUser';

function Signin () {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const { setUserId } = useUser()

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
  
      try {
          const response = await fetch("/api/login/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              credentials: "same-origin",
              body: JSON.stringify({ name, password }),
          });
  
          if (!response.ok) {
            throw new Error("Login failed")
          }
          const data = await response.json()
          setUserId(data.username)
          navigate('/user')
  
          
      } catch (error) {
          console.error("Login error:", error)
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
                Enter your Username below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="name"
                        type="name"
                        placeholder="Email"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
