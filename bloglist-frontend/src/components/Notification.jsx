const Notification = ({ message, className }) => {
  if (message === null) {
    return null;
  }

  return (
    <div>
      <p className={className}>{message}</p>
    </div>
  );
};

export default Notification;
