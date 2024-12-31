import { setLoading, setUser } from '@/redux/appSlice';
import { USER_API_END_POINT } from '@/utils/constant';
import { Label } from '@radix-ui/react-label';
import image from '../../../public/AdmLoginImg.png';
import React, { useState } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';

function AdmLogin() {

    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const { loading } = useSelector(store => store.app);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // Clear error when typing
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // Validate inputs
        let validationErrors = {};
        if (!input.email) validationErrors.email = "Please fill in your email.";
        if (!input.password) {
            validationErrors.password = "Please fill in your password.";
        } else if (input.password.length < 5) {
            validationErrors.password = "Password must be at least 5 characters long.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/administration/login`, input, {
                header: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                dispatch(setUser(res.data.user));
                navigate("/administration");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className='flex flex-col items-center gap-16 bg-gray-50 min-h-screen'>
             <h1 className="text-5xl  font-inter mt-16 font-bold text-gray-800 drop-shadow-md text-center">
                Academic Portal
            </h1>

            <div className="flex w-[80vw] md:w-[750px] h-[450px] shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200 ">
                {/* Left Container */}
                <div className="w-full flex flex-col items-center md:w-1/2">
                    <form onSubmit={submitHandler} className="my-10 flex flex-col">
                        <h1 className="text-3xl font-inter font-bold text-gray-700 mb-10 mt-4">Admin Login</h1>
                        
                        {/* Email Input */}
                        <div className="my-2 w-[250px]">
                            <Label>Email</Label>
                            <Input 
                                value={input.email} 
                                name="email" 
                                onChange={changeEventHandler} 
                                type="email" 
                                placeholder="Email" 
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        
                        {/* Password Input */}
                        <div className="my-2 w-[250px]">
                            <Label>Password</Label>
                            <Input 
                                value={input.password} 
                                name="password" 
                                onChange={changeEventHandler} 
                                type="password" 
                                placeholder="Password" 
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        
                        {/* Submit Button */}
                        {
                            loading 
                                ? <Button className="w-full my-4"> 
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                  </Button>
                                : <Button type="submit" className="w-full my-4 bg-[#29648A]">Login</Button>
                        }
                    </form>
                </div>

                {/* Right Container */}
                <div className="hidden md:block w-1/2">
                    <img
                        className="object-cover w-full h-full rounded-r-xl"
                        src={image}
                        alt="Login Illustration"
                    />
                </div>
            </div>
        </div>
    );
}

export default AdmLogin;
