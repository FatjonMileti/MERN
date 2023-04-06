import { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Register() {
  const [error, setError] = useState(null)
  const [register, setRegister] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required")
  });

  const handleSubmit = (values: { email: string, password: string }) => {
    const configuration = {
      method: "post",
      url: "https://auth-backend.toni5107.repl.co/register",
      data: {
        email: values.email,
        password: values.password,
      },
    };

    axios(configuration)
      .then((result) => {
        setRegister(true);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  }

  return (
    <>
      <h2>Register</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Field 
                type="email" 
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
              />
              <ErrorMessage name="email" component="div" className="invalid-feedback" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Field
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Password"
                className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
              />
              <ErrorMessage name="password" component="div" className="invalid-feedback" />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
            >
              Register
            </Button>
            {register ? (
              <p className="text-success">You Are Registered Successfully</p>
            ) : (
              <p className="text-danger">You Are Not Registered</p>
            )}
            {error && <div className="error">{error}</div>}
          </Form>
        )}
      </Formik>
    </>
  )
}