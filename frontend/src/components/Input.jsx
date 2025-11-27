const Input = ({ label, ...props }) => (
  <div className="input-group">
    <label>{label}</label>
    <input {...props} className="styled-input" />
  </div>
);
// Necesitarás añadir estilos para .input-group y .styled-input en tu CSS.

export default Input;