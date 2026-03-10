const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const formatedate = (date: string) => {
  const newdate = new Date(date);
  const dateFormat = newdate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return dateFormat;
};

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, ""); // strip non-digits
  return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};

export { isValidEmail, formatedate, formatPhone };
