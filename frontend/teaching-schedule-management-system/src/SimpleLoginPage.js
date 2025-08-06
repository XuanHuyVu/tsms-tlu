import React from "react";

const SimpleLoginPage = () => {
  return (
    <div>
      <h1>Simple Login Page</h1>
      <form>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SimpleLoginPage;
