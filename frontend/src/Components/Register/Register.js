import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './register.css';
import caricon from '../../images/car.png';


const Register = ({ setLoginUser }) => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        city: "",
        address: "",
    })

    const [showcity, setShowcity] = useState(false);
    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,//spread operator 
            [name]: value
        })
        if (e.target.id == "create-account-role") {
            if (e.target.value == "CabDriver") {
                setShowcity(true)
            }
            else {
                setShowcity(false)
            }
        }
    }
    //register function 
    const register = () => {
        const { name, email, password, role } = user
        if (name && email && password && role) {
            axios.post("http://localhost:6969/Register", user)
                .then(res => {

                    if (res.data.message == "Successfully Registered.") {
                        showcontent();
                    }
                    else {
                        alert(res.data.message)
                    }
                    //console.log(res)

                }
                )

        }
        else {
            alert("invalid input")
        };
    }

    const navigate = useNavigate()
    const [values, setValues] = useState({
        email: "",
        password: ""
    })

    // const sigin = () => {
    //     navigate("/login")
    // }

    // const login = () => {
    //     alert("hlo");
    //     axios.post("http://localhost:6969/Login", loginuser)
    //         .then(res => {

    //             console.log("jjj");
    //             alert(res.data)
    //             setLoginuser(res.data.loginuser);
    //             console.log("ghghgh",loginuser)
    //             navigate("/userdashboard")
    //         })
    // }

    const login = (event) => {
        event.preventDefault();

        // navigate('/admin')
        axios.post("http://localhost:6969/Login", values)
            .then(res => {
                //console.log("hgghhghg", res.data);

                //setLoginUser(res.data.values)
                if (res.data.message == "login successfully") 
                {
                    localStorage.setItem('currentUser', res.data.user.name)
                    navigate('/userdashboard')
                    if (res.data.user.role == 'Admin') {
                        //localStorage.setItem('currentUser', JSON.stringify(res.data))
                        navigate('/admindashboard')

                    }
                    else if (res.data.user.role == 'CabDriver') {
                        //localStorage.setItem('currentUser', JSON.stringify(res.data))
                        navigate("/cabdriverdashboard")

                    }
                    else {
                        navigate("/userdashboard")
                    }

                }
                else {
                    alert(res.data.message)
                }

            }
        )
    }

    const handleloginChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,//spread operator 
            [name]: value
        })
    }

    const showcontent = () => {

        setShowlogin(!showlogin);
        setShowRegister(!showRegister)

    }
    const [showlogin, setShowlogin] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    return (
        <>
            <section className='register-section'>
                <div className="d-flex">
                    <div className='col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 logo-intro'>
                        {/* <img src={Car} className="car-img"/> */}
                        <div className='inner-section-first'>
                            <div className='taxi-text'> <p className='taxi-taxi'>Taxi Taxi...</p></div>
                           
                           
                            <br/>
                            <div className='car-icon'><img src={caricon} className="car-icon-home" /></div>

                           
                        </div>
                    </div>
                    <div className='col-xs-12 col-sm-12 col-12 col-md-6 col-lg-8 col-xl-8 form-section'>
                        {showRegister && (
                            <div class="flex register-user flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
                                <div class="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
                                    Create a new account
                                </div>

                                <div class="p-6 mt-15 form-submit">
                                    {/* <form > */}
                                    <div class="flex flex-col mb-3">
                                        <div class=" relative ">
                                            <input type="text" id="create-account-pseudo" class="input-box rounded-lg  flex-1 appearance-none  w-full py-2 px-4 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="name" value={user.name} onChange={handleChange} placeholder="FullName" />
                                        </div>
                                    </div>
                                    <div class="flex gap-4 mb-3">
                                        <div class=" relative ">
                                            <input type="text" id="create-account-first-name" class=" input-box  rounded-lg  flex-1 appearance-none w-full py-2 px-4  placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="email" value={user.email} onChange={handleChange} placeholder="Email" />
                                        </div>
                                    </div>
                                    <div class="flex flex-col mb-3">
                                        <div class=" relative ">
                                            <input type="password" id="create-account-email" class="input-box   rounded-lg  flex-1 appearance-none w-full py-2 px-4 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="password" value={user.password} onChange={handleChange} placeholder="password" />
                                        </div>
                                    </div>
                                    <div class="flex flex-col mb-3">
                                        <div class=" relative ">
                                            <input type="text" id="create-account-adddress" class="input-box   rounded-lg  flex-1 appearance-none w-full py-2 px-4 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="address" value={user.address} onChange={handleChange} placeholder="address" />
                                        </div>
                                    </div>
                                    <div class="flex flex-col mb-3">
                                        <select type="text"
                                            name="role"
                                            id="create-account-role"
                                            class="input-box select-role  rounded-lg  flex-1 appearance-none w-full py-2 px-4 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                            value={user.role}
                                            onChange={handleChange}
                                            placeholder="Role"
                                             >
                                            <option value="0" style={{ color: 'black' }} className='input'>Choose Your Role</option>
                                            <option style={{ color: "black" }} value="Admin" className='input'>Admin</option>
                                            <option style={{ color: "black" }} value="User" className='input'>User</option>
                                            <option style={{ color: "black" }} value="CabDriver" className='input'>Cab Driver</option>
                                        </select>
                                    </div>

                                    {showcity && (
                                        <div class="flex flex-col mb-3">
                                            <div class=" relative ">
                                                <input type="text" id="create-account-city" class="input-box   rounded-lg  flex-1 appearance-none w-full py-2 px-4 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="city" value={user.city} onChange={handleChange} placeholder="city" />
                                            </div>
                                        </div>
                                    )}

                                    <div class="flex w-full my-4">
                                        <button type="button" class="py-2 px-4 register-btn " onClick={register} >
                                            Register
                                        </button>
                                    </div>

                                    <span class="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
                                        Already have an account ?
                                        <p class="text-sm underline hover:text-blue-700 sign-in" onClick={showcontent}>
                                            Sign in here...
                                        </p>
                                    </span>

                                    {/* </form> */}
                                </div>
                            </div>
                        )}


                        {/* login */}
                        {showlogin && (
                            <div class="flex register-user flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
                                <div class="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
                                    Login To Your Account
                                </div>
                                <div class="mt-8">
                                    <form autoComplete="off">
                                        <div class="flex flex-col mb-3">
                                            <div class="flex relative ">
                                                {/* <span class="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                                                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z">
                                                        </path>
                                                    </svg>
                                                </span> */}
                                                <input type="email" id="sign-in-email" class="input-box rounded-r-lg flex-1 appearance-none  w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="email" value={values.email} onChange={handleloginChange} placeholder="Your email" />
                                            </div>
                                        </div>
                                        <div class="flex flex-col mb-6">
                                            <div class="flex relative ">
                                                {/* <span class="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                                                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z">
                                                        </path>
                                                    </svg>
                                                </span> */}
                                                <input type="password" id="sign-in-password" class="input-box rounded-r-lg flex-1 appearance-none  w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="password" value={values.password} onChange={handleloginChange} placeholder="Your password" />
                                            </div>
                                        </div>
                                        <div class="flex items-center mb-6 mt-4">
                                            <div class="flex ml-auto">
                                                <a href="#" class="inline-flex forgot-password text-xs font-thin text-gray-500 sm:text-sm dark:text-gray-100 hover:text-gray-700 dark:hover:text-white">
                                                    Forgot Your Password?
                                                </a>
                                            </div>
                                        </div>
                                        <div class="flex w-full mt-4">
                                            <button class="py-2 px-4 register-btn " onClick={login}>
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div class="flex items-center justify-center dont-have-acc">

                                    <span class="ml-2">
                                        You don&#x27;t have an account?
                                    </span>
                                    <p className="sign-up" onClick={showcontent}>
                                        signup here..
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

        </>
    )
}

export default Register