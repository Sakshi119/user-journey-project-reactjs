import React, { useEffect, useRef, useState } from 'react'
import "../styles/otpVerify.scss"
import { useNavigate } from 'react-router-dom'
const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(30)
  const inputRefs = useRef([])
  const navigate = useNavigate()

  //on load saved OTP
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("otp"))
    if (saved) setOtp(saved)
  }, [])

  //save on change
  useEffect(() => {
    localStorage.setItem("otp", JSON.stringify(otp))
  }, [otp])

  //timer countdown
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])


  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp)


    //move to next box
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown=(e,index)=>{
    if(e.key === "Backspace" && otp[index] === "" && index > 0){
      inputRefs.current[index-1].focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const finalOtp = otp.join("")

    if(finalOtp.length != 6){
      alert("please enter the complete 6-digit OTP")
      return;
    }

    // if OTP correct -> go to personal details
    navigate("/personal")
  }

  const resendOtp=()=>{
    setTimer(30);
    alert("OTP re-sent!");
  }

  return (
    <main className='otp-container'>
      <h1 className='title'>Verify OTP</h1>
      <p className='subtitle'>Enter the 6-digit OTP sent to your mobile.</p>

      <form onSubmit={handleSubmit}>
        <div className="otp-boxes">
          {otp.map((digit, index) => (
            <input key={index} type='text' maxLength={1}
              value={digit} ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}></input>
          ))}
        </div>


        <div className='timer'>
          {timer > 0 ? (
            <span>Resent OTP in {timer}s</span>
          ):(
            <button type="button" className='link-btn' onClick={resendOtp}>Resend OTP</button>
          )}
        </div>

        <button className='btn-primary' type='submit'>
          Verify & Continue
        </button>
      </form>
    </main>
  )
}

export default OtpVerify