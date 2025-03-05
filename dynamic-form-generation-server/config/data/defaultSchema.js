const defaultSchema = {
  title: "User Registration",
  fields: [
    {
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      minLength: 2,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      minLength: 6,
    },
    {
      name: "birthdate",
      label: "Birthdate",
      type: "date",
      required: true,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["Male", "Female", "Other"],
      required: true,
    },
  ],
};

module.exports = defaultSchema;
