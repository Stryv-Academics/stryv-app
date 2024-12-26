const config = {
  appName: "Stryv", // App name
  description: "Stryv Academics is a peer-to-peer tutoring platform.", // App description

  // Dynamically set the domain based on environment
  domainName:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000" // Development URL
      : "https://stryvacademics.com", // Production URL

  supportEmail: "support@stryvacademics.com", // Support email address
  defaultRedirect: "/", // Default redirect after login or signup
};

export default config;
