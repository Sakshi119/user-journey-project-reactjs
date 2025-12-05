import React, { useState } from 'react'
import '../styles/personalDetails.scss'

const PersonalDetails = ({ onNext, onBack, savedData }) => {

  const [form, setForm] = useState({
    name: savedData?.name || "",
    dob: savedData?.dob || "",
    email: savedData?.email || "",
    address: savedData?.address || "",
    city: savedData?.city || "",
    state: savedData?.state || "",
    pin: savedData?.pin || ""
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    let err = {};

    if (!form.name.trim()) err.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Invalid Email";
    if (!form.dob.trim()) err.dob = "Required";
    if (!form.address.trim()) err.address = "Required";
    if (!form.city.trim()) err.city = "Required";
    if (!form.state.trim()) err.state = "Required";
    if (!/^\d{6}$/.test(form.pin)) err.pin = "Pin must be 6 digits";

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  const handleNext = () => {
    if (validate()) {
      onNext(form);
      console.log(form,"form")
    }
  }

  return (
    <div className='form-container'>
      <h2>Personal Details</h2>

      <div className='form-group'>
        <label>Full Name</label>
        <input name='name' value={form.name} onChange={handleChange} />
        {errors.name && <p className='error'>{errors.name}</p>}
      </div>

      <div className='form-group'>
        <label>Date of Birth</label>
        <input type='date' name='dob' value={form.dob} onChange={handleChange} />
        {errors.dob && <p className='error'>{errors.dob}</p>}
      </div>

      <div className="form-group">
        <label>Email ID</label>
        <input name="email" value={form.email} onChange={handleChange} />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} />
        {errors.address && <p className="error">{errors.address}</p>}
      </div>

      <div className="form-group">
        <label>City</label>
        <input name="city" value={form.city} onChange={handleChange} />
        {errors.city && <p className="error">{errors.city}</p>}
      </div>

      <div className="form-group">
        <label>State</label>
        <input name="state" value={form.state} onChange={handleChange} />
        {errors.state && <p className="error">{errors.state}</p>}
      </div>

      <div className="form-group">
        <label>Pin Code</label>
        <input name="pin" value={form.pin} onChange={handleChange} />
        {errors.pin && <p className="error">{errors.pin}</p>}
      </div>

      <div className='actions'>
        <button onClick={onBack}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>

    </div>
  )
}

export default PersonalDetails