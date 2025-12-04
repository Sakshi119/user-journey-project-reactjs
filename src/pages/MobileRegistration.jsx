import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MobileRegistration = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("")

  //load saved value
  useEffect(()=>{
    const saved = localStorage.getItem("mobile");
    if(saved) setMobile(saved)
  },[])

  //save value automatically
  useEffect(()=>{
    localStorage.setItem("mobile",mobile)
  },[mobile])


  const handleSubmit=(e)=>{
    e.preventDefault()

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    navigate("/verify-otp")
  }

  return (
    <main className='mobile-container'>
      <h1 className='title'>Mobile Registration</h1>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor='mobile'>Enter your mobile number</label>

        <input type='tel' id='mobile' aria-label='Mobile Number'
          placeholder='8774563986' maxLength={10} value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
          required />

        <button type='submit' className='btn-primary'>Send OTP</button>  
      </form>
    </main>
  )
}

export default MobileRegistration