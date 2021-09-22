import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signup } from "../firebase/auth";
import { useHistory } from "react-router-dom";
import { useSession } from "../firebase/UserProvider";

//Signup pagina

function Signup(props) {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();
  const { user } = useSession();

  if (user !== null) {
    props.history.push(`/exercises`);
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data);
      reset();
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
      history.push("/exercises");
      reset();
    }
  };

  const formClassName = `ui form ${isLoading ? "loading" : ""}`;

  function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
  }

  function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value === "") {
      parent.classList.remove("focus");
    }
  }
  const inputFocus = () => {
    const inputs = document.querySelectorAll(".input");
    inputs.forEach((input) => {
      input.addEventListener("focus", addcl);
      input.addEventListener("blur", remcl);
    });
  };

  window.addEventListener("load", inputFocus);
  window.addEventListener("click", inputFocus);
  window.addEventListener("mouseover", inputFocus);

  return (
    <section className="banner login">
      <div className="bannertext">
        <div className="login-container">
          <div className="ui card login-card">
            <div className="content login-content">
              <form
                className={formClassName}
                onSubmit={handleSubmit(onSubmit)}
                style={{ width: "90%", maxWidth: "400px", margin: "auto" }}
              >
                <div className="input-div login-div one">
                  <div className="i">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="div">
                    <h5>First name</h5>
                    <input
                      required
                      type="text"
                      name="firstname"
                      className="input"
                      ref={register}
                    />
                  </div>
                </div>
                <div className="input-div login-div one">
                  <div className="i">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="div">
                    <h5>Last name</h5>
                    <input
                      required
                      type="text"
                      name="lastname"
                      className="input"
                      ref={register}
                    />
                  </div>
                </div>
                <div className="input-div login-div one">
                  <div className="i">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="div">
                    <h5>Email</h5>
                    <input
                      required
                      type="email"
                      name="email"
                      className="input"
                      ref={register}
                    />
                  </div>
                </div>
                <div className="input-div login-div pass">
                  <div className="i">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="div">
                    <h5>Password</h5>
                    <input
                      required
                      type="password"
                      name="password"
                      className="input"
                      ref={register}
                    />
                  </div>
                </div>
                <div className="input-div login-div pass">
                  <div className="i">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="div">
                    <h5>Confirm password</h5>
                    <input
                      required
                      type="password"
                      name="cfpassword"
                      className="input"
                      ref={register}
                    />
                  </div>
                </div>
                <div className="field actions">
                  <button className="bn632-hover bn21" type="submit">
                    <b>Signup</b>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
