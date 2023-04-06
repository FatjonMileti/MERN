import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const cookies = new Cookies();

export default function Login() {
  const [error, setError] = useState(null)
  const [login, setLogin] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required")
  });

  const handleSubmit = (values) => {
    const configuration = {
      method: "post",
      url: "https://auth-backend.toni5107.repl.co/login",
      data: {
        email: values.email,
        password: values.password,
      },
    };

    axios(configuration)
      .then((result) => {
        cookies.set("TOKEN", result.data.token, {
          path: "/",
        });
        cookies.set("REFRESH_TOKEN", result.data.refreshToken, {
          path: "/",
        });

        window.location.href = "/Dashboard";
        
        setLogin(true);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
    
  }

  return (
    <>
      <h2>Login</h2>
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
              Login
            </Button>
            {login ? (
              <p className="text-success">You Are Logged in Successfully</p>
            ) : (
              <p className="text-danger">You Are Not Logged in</p>
            )}
            {error && <div className="error">{error}</div>}
          </Form>
        )}
      </Formik>
    </>
  );
}