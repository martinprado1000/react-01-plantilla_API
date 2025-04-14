import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUsersContext } from "../../contexts/UsersContext";

//Sweet Alert 2
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function BodyRecoveryPassword() {
  const { actionUser } = useUsersContext();
  const navigate = useNavigate();
  // Validate useForm
  const {
    register,
    formState: { errors }, // Son los valores del objeto error
    watch, // Guarda el valor actual de los inputps
    handleSubmit,
    reset, // resetea TODO el formulario cuando lo llamo
    resetField, // restea el input seleccionado, ej: setValue("password")
    setValue, // Le asigna el valor que le asignemos a un input, ej: setValue("email","")
  } = useForm({
    defaultValues: {
      // Con defaultValues le podemos asignar valores por defecto al campo que deseamos, si no queremos asignar ningun valor por defecto ejecuto el useForm sin ningun valor: useForm();
      //marca: marcaEdit
      //apellido: '',
    },
  });

  const recoveryPass = async (data) => {
    const res = await actionUser("recoveryPassword", data);

    if (res) {
      Swal.fire({
        title: res.message,
        icon: "warning", // succes , warning , info , question, error
        timer: 3000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        title: "Se envio un correo con la nueva contraseña",
        icon: "success", // succes , warning , info , question, error
        timer: 4000,
        timerProgressBar: true,
      });
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    }
  };

  return (
    <Form className="container mt-4" onSubmit={handleSubmit(recoveryPass)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="fs-6">
          Ingrese el email donde se enviará la nueva contraseña
        </Form.Label>
        <Form.Control
          className="mt-2"
          type="email"
          placeholder="Ingrese su email"
          {...register("email", {
            required: {
              value: true,
              message: "La campo email es requerido",
            },
            pattern: {
              // pattern es para validar expresiones regulares
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Email inválido",
            },
          })}
        />
        {errors.email && (
          <p className="text-danger mt-1">{errors.email.message}</p>
        )}
      </Form.Group>
      <Form.Group className="mb-4" controlId="formBasicPassword">
        <Button variant="primary" type="submit" className="mt-3">
          Recuperar contraseña
        </Button>
      </Form.Group>
    </Form>
  );
}

export default BodyRecoveryPassword;
