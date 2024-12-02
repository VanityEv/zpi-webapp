import { Box } from "@mui/material"
import { RegisterPanel } from "../components/RegisterPanel/RegisterPanel"
import { ToastContainer } from "react-toastify"

export const Register = () => {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <RegisterPanel />
      <ToastContainer />
    </Box>
  )
}