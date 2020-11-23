import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import style from './login-form.module.scss';

const LoginForm = ({ handleLogin, errorMessage }) => {
  return (
    <div className={style.wrapper}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address.')
            .required('Email is required.'),
          password: Yup.string()
            .min(6, 'Must at least 6 character.')
            .required('Password is required.'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            handleLogin(values);
            setSubmitting(false);
          }, 400);
        }}
      >
        <Form>
          <h3>Please login to proceed.</h3>
          <hr />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <div>
            <Field
              placeholder='Email address'
              name='email'
              type='email'
              autoFocus
            />
            <span className={style.error}>
              <ErrorMessage name='email' />
            </span>
          </div>
          <div>
            <Field placeholder='Password' name='password' type='password' />
            <span className={style.error}>
              <ErrorMessage name='password' />
            </span>
          </div>
          <button type='submit'>Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;
