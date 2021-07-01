import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../firebase/auth";
import { Link } from "react-router-dom";
import { useSession } from "../firebase/UserProvider";

function Login(props) {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [showPassError, setPassError] = useState("hidden");
  const [showError, setError] = useState("hidden");
  const { user } = useSession();

  if (user !== null) {
    props.history.push(`/exercises`);
  }

  const onSubmit = async (data) => {
    let user;
    setLoading(true);
    try {
      user = await login(data);
      reset();
    } catch (error) {
      console.log(error);
      if (error.code === "auth/wrong-password") {
        setPassError("show");
      } else {
        setError("show");
      }
    }

    if (user) {
      props.history.push(`/exercises`);
    } else {
      setLoading(false);
    }
  };
  const formClassName = `${isLoading ? "loading" : ""}`;

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
              <h4 className="bannerTitle">Login</h4>
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
                    <h5>Email</h5>
                    <input
                      onClick={() => inputFocus()}
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
                      onClick={() => inputFocus()}
                      required
                      type="password"
                      name="password"
                      id="password"
                      className="input"
                      ref={register}
                    />
                  </div>
                </div>
                <p className={showPassError + " errorText"}>Error 1</p>
                <p className={showError + " errorText"}>Error 2</p>
                <div className="field actions">
                  <button className="bn632-hover bn21" type="submit">
                    <b>Log in</b>
                  </button>
                </div>
                <Link
                  to="/reset"
                  style={{ marginTop: "30", color: "white", float: "right" }}
                >
                  Forgot password ?
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
