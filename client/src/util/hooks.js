import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    //depending on what page is use this hook, callback will be different
    callback();
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
