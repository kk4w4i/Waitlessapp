import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import Logo from '../assets/waitless-logo.webp'

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

function Signup () {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate()
    const { setUserId } = useUser()

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
      
        console.log(firstName, lastName, email, password)
        try {
          const response = await fetch("/api/signup/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify({ firstName, lastName, email, password }),
          });
      
          if (response.ok) {
            const data = await response.json()
            setUserId(data.username)
            navigate("/user")
            
          } else {
            throw new Error("Login failed")
          }

        } catch (error) {
          console.error("Signup error:", error);
          setErrorMessage("An error occurred during signup. Please try again.");
        }
      };
      

  return (
    <div>
        <button onClick={() => window.location.href = '/'}>
            <img className='fixed bottom-10 h-[30px] left-1/2 -translate-x-1/2' src={Logo}></img>
        </button>
        <Card className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 mx-auto w-[80vw] md:w-[30vw] border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                        id="first-name"
                        placeholder="Max"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                        id="last-name"
                        placeholder="Robinson"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    </div>
                </div>
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <Button type="submit" className="w-full rounded-md">
                    Create an account
                </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="underline">
                    Sign in
                </Link>
                </div>
            </CardContent>
        </Card>
    </div>
    
  )
}

export default Signup